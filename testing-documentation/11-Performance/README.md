# Workshop 10 — Non-functional testing

The [k6 script](recipes-load-test.js) exercises authenticated GET /api/recipes on loopback only. It creates one disposable buyer per run. Ten VUs run for ten seconds with a 100 ms pause per iteration. Thresholds are p95 below 500 ms, request failure rate below 1%, and all checks passing. The check verifies a 200 JSON array on every listing. Run the exact commands in [the reproduction guide](../../HOW-TO-RUN-TESTS.md).

See the [measurement report](Non-Functional-Test-Report.md) and [raw exports](../13-Test-Results/Performance/).
