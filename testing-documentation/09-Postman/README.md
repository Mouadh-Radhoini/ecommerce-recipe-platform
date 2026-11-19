# Workshop 8 — Postman and Newman

Import the [collection](Ecommerce-Recipe-Platform.postman_collection.json) and [environment](Test-Environment.postman_environment.json). Run the whole collection in order. `baseUrl` defaults to `http://localhost:18081` and accepts an isolated local port. Collection variables hold disposable accounts, passwords, JWTs and recipe IDs at runtime.

The collection covers buyer and chef registration, login, listing, chef publication, validation, premium previews and pending orders. Creation returns HTTP 200 under the current application contract. Missing JWT and wrong role return 401 and 403 with empty bodies. Bad login returns 401 with an error string. DTO failures return 400 field maps. Missing resources return 404 and duplicate email or order returns 409. Unpaid premium recipe detail returns a 200 preview with protected fields empty and `fullAccess=false`. Only disposable PENDING orders are created through the HTTP tests.

Run `NODE_PATH="$PWD/testing/validation/node_modules" node testing/validation/run-newman.cjs` after installing the locked tools and starting the stack. The [final JSON](../13-Test-Results/API/newman.json) records status and assertion results. Request headers, raw bodies, credentials and response payloads are excluded from the export.
