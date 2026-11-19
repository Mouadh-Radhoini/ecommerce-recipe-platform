# Run the software validation campaign on Kali Linux

Run the commands from the repository root or extracted submission root unless a subshell changes directories. On the author’s workstation, the checkout is `/home/mouadh/Documents/ecommerce-recipe-platform`. Use JDK 17 or 21, Node.js 24, npm, Docker Engine, curl, OpenSSL, Chromium or Playwright's browser, and k6. Java source and bytecode target 17. The Maven Wrapper installs Maven 3.9.12 on first use. The first dependency installation needs network access.

```bash
cd /path/to/ecommerce-recipe-platform
java -version
(cd backend && ./mvnw -v)
node --version
npm --version
k6 version
npm ci --prefix frontend
npm ci --prefix testing/validation
export NODE_PATH="$PWD/testing/validation/node_modules"
"$NODE_PATH/.bin/playwright" install chromium
# For a system-installed Chromium, use this instead of the browser download:
# export RECIPE_CHROMIUM=/usr/bin/chromium
```

## Start a dedicated MongoDB instance

Use a fresh container with no mounted development data. If the dedicated container is already running, use the ping command to confirm it is ready.

```bash
docker run --rm -d --name recipe-university-validation \
  -p 127.0.0.1:27031:27017 mongo:7
docker exec recipe-university-validation mongosh --quiet \
  --eval 'db.adminCommand({ping:1}).ok'
export RECIPE_TEST_MONGO_PORT=27031
```

The integration suite uses a randomly named database and deletes only fixture IDs it owns. Data remains disposable inside this dedicated container. Integration uses a loopback port distinct from MongoDB's development default.

## Run Maven tests and coverage

```bash
(cd backend && ./mvnw clean test)
(cd backend && ./mvnw -Dtest=BusinessRulesTest test)
(cd backend && ./mvnw -Pvalidation clean verify)
(cd backend && ./mvnw -Pvalidation failsafe:integration-test failsafe:verify)
(cd backend && ./mvnw com.github.spotbugs:spotbugs-maven-plugin:4.9.3.0:spotbugs)
```

Use the complete `verify` lifecycle before the standalone integration repeat so Failsafe has the compiled tests. Coverage HTML and XML appear in `backend/target/site/jacoco/`. Test XML appears in `backend/target/surefire-reports/` and `backend/target/failsafe-reports/`.

## Start the application for individual live tests

Backend terminal, from the repository root:

```bash
(cd backend && export JWT_SECRET=$(openssl rand -hex 32) \
  SPRING_DATA_MONGODB_URI=mongodb://127.0.0.1:27031/recipe_validation_manual \
  SERVER_ADDRESS=127.0.0.1 SERVER_PORT=18084 && ./mvnw spring-boot:run)
```

Frontend terminal, from the repository root:

```bash
printf '%s\n' '{"/api/**":{"target":"http://127.0.0.1:18084"}}' > /tmp/recipe-validation-manual-proxy.json
npm start --prefix frontend -- --host 127.0.0.1 --port 14203 \
  --proxy-config /tmp/recipe-validation-manual-proxy.json
```

Test terminal:

```bash
npm run build --prefix frontend
npm test --prefix frontend -- --watch=false
export NODE_PATH="$PWD/testing/validation/node_modules"
export RECIPE_API_URL=http://127.0.0.1:18084 RECIPE_UI_URL=http://127.0.0.1:14203
node testing/validation/run-newman.cjs
"$NODE_PATH/.bin/playwright" test -c frontend/e2e/playwright.config.cjs
k6 run testing-documentation/11-Performance/recipes-load-test.js
```

The Newman runner saves a credential-free JSON export. Playwright repeats the journey twice by default. Failure traces can include disposable fixture credentials and must be reviewed privately before sharing any derivative evidence.

## Run the full regression and local CI simulation

```bash
bash testing/validation/campaign.sh
```

This runs the Java build and verification, repeats MongoDB integration, analyzes Java bytecode, installs and builds Angular, runs Angular unit tests, starts an isolated backend and Angular server, runs Newman and Playwright, and runs k6 twice. The default simulation ports are 18083 and 14202. Use `RECIPE_API_PORT` and `RECIPE_UI_PORT` if either is occupied. Set `K6_BIN` if the binary is outside PATH. Find the exit codes in `testing-documentation/13-Test-Results/CI/exit-codes.tsv` and the categorized evidence under `testing-documentation/13-Test-Results/`. Preserve any previous campaign evidence before rerunning into the same directories.

To replay or inspect the optional credential-free route-guard trace while the isolated Angular server is running:

```bash
node frontend/e2e/record-route-guard.cjs
"$NODE_PATH/.bin/playwright" show-trace testing-documentation/13-Test-Results/UI/anonymous-route-guard.zip
```
