# Recipe Marketplace testing and validation

Angular serves the browser application. Its development server proxies `/api/**` to Spring Boot. The backend validates JWTs, enforces buyer and chef roles, and stores users, recipes, and orders in MongoDB. The backend owns recipe pricing and decides whether an order unlocks premium ingredients and steps.

## Kali setup

Install a JDK (17 or 21), Node.js 24 with npm, Docker with daemon access, OpenSSL, and Python 3. The checks in this working tree used Node 24.21.0 and npm 12.2.0. The Maven wrapper was run under JDK 25.0.5 on Kali and compiled with Java release 17. Chromium and a matching ChromeDriver are needed for the browser smoke. Commands below start from the repository root unless stated otherwise.

### Terminal 1 — database

```sh
docker run -d --name recipe-mongo-dev -p 127.0.0.1:27029:27017 -v recipe-mongo-dev-data:/data/db mongo:7
```

For later sessions, start the existing container with `docker start recipe-mongo-dev`. If using the verification container already bound to 27029, reuse it and choose a fresh database name, or choose another free published port. Use only an isolated local database for the smoke scripts.

### Terminal 2 — backend

```sh
cd backend
export JWT_SECRET="$(openssl rand -hex 32)"
export SPRING_DATA_MONGODB_URI=mongodb://127.0.0.1:27029/recipe_smoke
export SERVER_ADDRESS=127.0.0.1
export SERVER_PORT=18081
./mvnw spring-boot:run
```

For a session that should survive backend restarts, supply the same locally stored key through the environment. Keep the key out of source control and shell history.

### Terminal 3 — frontend

```sh
cd frontend
npm ci
printf '%s\n' '{"/api/**":{"target":"http://127.0.0.1:18081"}}' > /tmp/recipe-proxy-18081.json
npm start -- --host 127.0.0.1 --port 14200 --proxy-config /tmp/recipe-proxy-18081.json
```

Open [Recipe Marketplace](http://127.0.0.1:14200/). The default setup is `npm start` at port 4200 with the checked-in proxy pointing at backend port 8081. The verification machine had a listener on 8081, so the commands use 18081. Serve production builds behind a reverse proxy that routes `/api/**` to Spring Boot and supports Angular route fallback.

## Configuration

| Variable | Usage |
| --- | --- |
| `JWT_SECRET` | Required at runtime. Hex-encoded key of at least 32 random bytes. The context test generates its own key. |
| `SPRING_DATA_MONGODB_URI` | Defaults to `mongodb://127.0.0.1:27017/ecommerce_recipe_db`. Override for isolation. |
| `SERVER_ADDRESS` | Use `127.0.0.1` for local development. |
| `SERVER_PORT` | Defaults to 8081. Keep the Angular dev proxy target aligned. |
| `APP_CORS_ALLOWED_ORIGINS` | Optional comma-separated browser origins for direct API requests. Defaults to `http://localhost:4200,http://localhost:4201,http://127.0.0.1:4200`. Angular's proxy uses same-origin requests. |
| `RECIPE_SMOKE_URL` | Optional API smoke origin. Defaults to `http://127.0.0.1:18081`. |
| `RECIPE_BROWSER_URL` | Optional browser smoke origin. Defaults to `http://127.0.0.1:14200`. |

Stripe variables are unnecessary for local startup. Checkout creates a pending order and does not take payment.

## Test commands and existing tests

```sh
(cd backend && ./mvnw clean test)
(cd frontend && npm run build)
(cd frontend && npm test -- --watch=false)
python3 testing/integration/smoke.py
python3 testing/integration/browser-smoke.py
```

- Maven runs a Spring Boot context test under the application package. It checks configuration discovery and application wiring. The live API smoke checks MongoDB reads and writes.
- Angular Vitest checks the application shell and visitor navigation links.
- The Python scripts use only the standard library and generate fresh fixture accounts and passwords each run. The browser script starts and stops its own ChromeDriver and uses a temporary Chromium profile. Smoke data stays in the isolated database for inspection.

## Verification results

| Check | Result |
| --- | --- |
| Maven clean test | PASS · 1 test, 0 failures, 0 skips |
| npm ci and production build | PASS |
| Angular unit tests | PASS · 2 tests |
| Spring Boot startup and MongoDB connection | PASS · MongoDB 7 via isolated Docker container |
| Buyer and chef registration, login and JWT, invalid credentials | PASS |
| CORS preflight from Angular origin | PASS |
| Recipe creation, listing, persistence and detail | PASS |
| Anonymous and wrong-role recipe creation, chef order rejection | PASS · 401 for anonymous, 403 for wrong role |
| Pending order creation, history, free recipe rejection | PASS |
| Sequential and concurrent duplicate order rejection | PASS · one persisted order in the concurrent case |
| Owner access and pending-buyer redaction | PASS |
| Chromium navigation and live API integration | PASS · sign-in, both registrations, chef dashboard and recipe creation, buyer preview, pending checkout and order history, buyer dashboard denial |
| Payment completion and paid access through checkout | BLOCKED · Stripe session and verified webhook are unimplemented |

## Known limitations

- Stripe checkout, webhook handling, receipt details, and payment settlement are unimplemented. The UI keeps orders pending and premium content locked for unpaid buyers.
- Recipe editing, deletion, image upload, profile editing, and chef sales analytics have no complete API/UI flow. The chef dashboard shows published recipe count and links. Buyer order history is read-only.
- Existing comments, follows and notifications were outside the live smoke scope. Email uniqueness across buyer and chef collections still uses a pre-save check.
- npm 12 reported 56 known dependency advisories during installation. Dependency security upgrades were outside this repair, and the build and tests used the existing lockfile.

## University mini-project

Start with a requirements-to-test matrix for authorization, recipe persistence, pending orders, and premium access. Record expected status, observed status, fixture data, and evidence for each case. Run the current checks to establish the baseline, then add tests in this order.

1. [JUnit](junit/README.md) and [Mockito](mockito/README.md) for price validation, access rules, and repository interactions.
2. [Integration](integration/) tests with isolated MongoDB fixtures for cross-role authorization, concurrent orders, and paid-order access with seeded data.
3. [Postman](postman/README.md) for a portable API collection and [Playwright](playwright/README.md) for browser coverage.
4. [Performance](performance/README.md) for recipe listing and order submission after the functional baseline is stable.

Report pass/fail counts and link defects to reproducible test cases. Capture before-and-after evidence when fixing a defect.
