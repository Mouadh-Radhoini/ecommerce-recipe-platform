#!/usr/bin/env bash
set -uo pipefail
cd "$(dirname "$0")/../.."
root=$PWD
results="$root/testing-documentation/13-Test-Results"
tools="$root/testing/validation/node_modules"
export NODE_PATH="${RECIPE_NODE_MODULES:-$tools}"
export RECIPE_TEST_MONGO_PORT="${RECIPE_TEST_MONGO_PORT:-27031}"
if [[ ! "$RECIPE_TEST_MONGO_PORT" =~ ^[1-9][0-9]{3,4}$ ]] ||
   (( RECIPE_TEST_MONGO_PORT < 1024 || RECIPE_TEST_MONGO_PORT > 65535 || RECIPE_TEST_MONGO_PORT == 27017 )); then
  echo 'Choose a dedicated non-default loopback MongoDB port.'
  exit 1
fi
api_port="${RECIPE_API_PORT:-18083}"
ui_port="${RECIPE_UI_PORT:-14202}"
export RECIPE_API_URL="http://127.0.0.1:$api_port"
export RECIPE_UI_URL="http://127.0.0.1:$ui_port"
k6="${K6_BIN:-k6}"
work=$(mktemp -d)
api_pid=
ui_pid=
cleanup() {
  if [[ -n "$api_pid" ]]; then kill "$api_pid" 2>/dev/null || true; fi
  if [[ -n "$ui_pid" ]]; then kill -- "-$ui_pid" 2>/dev/null || true; fi
  rm -f "$work/proxy.json" "$work/k6-summary.json"
  rmdir "$work"
}
trap cleanup EXIT

mkdir -p "$results"/{CI,API,Unit,Integration,UI,Coverage,Performance,Screenshots,Logs}
status="$results/CI/exit-codes.tsv"
printf 'stage\texit_code\n' > "$status"
failed=0

run() {
  local name=$1 rc=0
  shift
  "$@" > "$results/CI/$name.log" 2>&1 || rc=$?
  printf '%s\t%s\n' "$name" "$rc" | tee -a "$status"
  if (( rc != 0 )); then failed=1; fi
  return "$rc"
}

archive_junit() {
  local source=$1 destination=$2
  local reports=("$source"/TEST-*.xml)
  [[ -f "${reports[0]}" ]] && cp "${reports[@]}" "$destination/"
}

backend_verified=0
run backend-verify bash -c 'cd backend && ./mvnw -B -Pvalidation clean verify' || backend_verified=$?
archive_junit backend/target/surefire-reports "$results/Unit"
archive_junit backend/target/failsafe-reports "$results/Integration"
if [[ -f backend/target/site/jacoco/jacoco.xml ]]; then
  cp -R backend/target/site/jacoco/. "$results/Coverage/"
fi
run integration-repeat bash -c 'cd backend && ./mvnw -B -Pvalidation failsafe:integration-test failsafe:verify'
mkdir -p "$results/Integration/repeat"
archive_junit backend/target/failsafe-reports "$results/Integration/repeat"
run spotbugs bash -c 'cd backend && ./mvnw -B com.github.spotbugs:spotbugs-maven-plugin:4.9.3.0:spotbugs'
if [[ -f backend/target/spotbugsXml.xml ]]; then
  cp backend/target/spotbugsXml.xml "$results/Logs/spotbugs.xml"
fi
run frontend-install npm ci --prefix frontend
run frontend-build npm run build --prefix frontend
run frontend-test npm test --prefix frontend -- --watch=false

ready() {
  local url=$1 wanted=$2 pid=$3 code
  for attempt in {1..45}; do
    kill -0 "$pid" 2>/dev/null || return 1
    code=$(curl -s --noproxy '*' -o /dev/null -w '%{http_code}' "$url")
    [[ "$code" == "$wanted" ]] && return 0
    sleep 1
  done
  return 1
}

if (( backend_verified != 0 )); then
  printf '%s\t%s\n' live-tests BLOCKED | tee -a "$status"
  exit "$failed"
fi
if curl -s --noproxy '*' -o /dev/null "$RECIPE_API_URL" ||
   curl -s --noproxy '*' -o /dev/null "$RECIPE_UI_URL"; then
  echo 'Choose unused validation ports.'
  exit 1
fi
JWT_SECRET=$(openssl rand -hex 32) \
SPRING_DATA_MONGODB_URI="mongodb://127.0.0.1:$RECIPE_TEST_MONGO_PORT/recipe_validation_live_${work##*.}" \
SERVER_PORT="$api_port" SERVER_ADDRESS=127.0.0.1 \
java -jar backend/target/backend-0.0.1-SNAPSHOT.jar > "$results/CI/backend-server.log" 2>&1 &
api_pid=$!
if run backend-ready ready "$RECIPE_API_URL/api/recipes" 401 "$api_pid"; then
  run newman node testing/validation/run-newman.cjs
  printf '{"/api/**":{"target":"%s"}}\n' "$RECIPE_API_URL" > "$work/proxy.json"
  setsid npm start --prefix frontend -- --host 127.0.0.1 --port "$ui_port" \
    --proxy-config "$work/proxy.json" > "$results/CI/frontend-server.log" 2>&1 &
  ui_pid=$!
  if run frontend-ready ready "$RECIPE_UI_URL" 200 "$ui_pid"; then
    run playwright "$NODE_PATH/.bin/playwright" test -c frontend/e2e/playwright.config.cjs
    index=0
    while IFS= read -r -d '' file; do
      ((index+=1))
      cp "$file" "$results/Screenshots/run-$index.png"
    done < <(find "$results/UI/artifacts" -name published-recipe.png -print0 | sort -z)
  fi
  for index in 1 2; do
    run "k6-$index" "$k6" run --summary-export "$work/k6-summary.json" \
      testing-documentation/11-Performance/recipes-load-test.js
    if [[ -f "$work/k6-summary.json" ]]; then
      run "k6-export-$index" python3 testing/validation/redact-k6-summary.py \
        "$work/k6-summary.json" "$results/Performance/run-$index.json"
      rm -f "$work/k6-summary.json"
    fi
  done
fi
exit "$failed"
