# API test report

**Result:** 23 requests, 46 assertions, 0 failures. The collection was executed in order against the isolated local stack using Newman 6.2.2. Runtime variables hold disposable fixtures and bearer tokens. The published export stores response codes and assertion outcomes.

The collection contains at least 13 negative scenarios. Missing JWT is 401 with an empty body. A malformed bearer returns 401 with a JSON error. Buyer publication is 403. Unpaid recipe detail is a 200 preview with its protected fields withheld.

| Scenario | HTTP | Assertions | Status |
|---|---:|---:|---|
| API-01 Register buyer | 200 | 2 | PASS |
| API-02 Register chef | 200 | 2 | PASS |
| API-03 Login buyer | 200 | 2 | PASS |
| API-04 Incorrect password | 401 | 2 | PASS |
| API-05 Missing JWT | 401 | 2 | PASS |
| API-06 Authenticated listing | 200 | 2 | PASS |
| API-07 Buyer cannot publish | 403 | 2 | PASS |
| API-08 Chef publishes premium recipe | 200 | 2 | PASS |
| API-09 Blank title rejected | 400 | 2 | PASS |
| API-10 Missing recipe | 404 | 2 | PASS |
| API-11 Unpaid premium content stays hidden | 200 | 2 | PASS |
| API-12 Duplicate email rejected across roles | 409 | 2 | PASS |
| API-13 Create pending order | 200 | 2 | PASS |
| API-14 Duplicate pending order rejected | 409 | 2 | PASS |
| API-15 Buyer sees pending order | 200 | 2 | PASS |
| API-16 Malformed registration email | 400 | 2 | PASS |
| API-17 Seven-character password rejected | 400 | 2 | PASS |
| API-18 Eight-character password accepted | 200 | 2 | PASS |
| API-19 Chef publishes free recipe | 200 | 2 | PASS |
| API-20 Free recipe purchase rejected | 400 | 2 | PASS |
| API-21 Empty ingredient list rejected | 400 | 2 | PASS |
| API-22 Empty step list rejected | 400 | 2 | PASS |
| API-23 Invalid JWT is denied | 401 | 2 | PASS |

The first draft of API-23 failed its body assertion because it expected the missing-token response. Source review confirmed the distinct JSON response. The corrected test passed on rerun. The four historical checks were re-executed within API-01/03/05/06.

[Canonical collection](Ecommerce-Recipe-Platform.postman_collection.json) · [Environment](Test-Environment.postman_environment.json) · [Newman evidence](../13-Test-Results/API/newman.json)
