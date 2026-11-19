# Baseline traceability and regression

The original 15-case catalogue is retained. Each baseline case now has a mapped API case in the automated regression. The identifiers below reference the collection and its current execution evidence.

| Baseline case | Regression | Asserted behavior |
|---|---|---|
| TC-01 | API-05 | Anonymous recipe listing returns 401 |
| TC-02 | API-01 | Buyer registration returns buyer identity and JWT |
| TC-03 | API-03 | Valid buyer credentials produce an authenticated buyer |
| TC-04 | API-06 | Authenticated recipe listing returns an array |
| TC-05 | API-04 | Wrong password returns 401 |
| TC-06 | API-16 | Malformed email fails validation |
| TC-07 | API-12 | Repeated email across roles returns 409 |
| TC-08 | API-17 | Seven-character password fails validation |
| TC-09 | API-18 | Eight-character password is accepted |
| TC-10 | API-07 | Buyer publication returns 403 |
| TC-11 | API-08, UI-01 | Chef creates a recipe and can retrieve it again |
| TC-12 | API-09 | Blank title fails validation |
| TC-13 | API-11, IT-07, UT-07 | Unpaid preview and pending order keep details hidden |
| TC-14 | API-19/20, UT-03 | Free recipe is priced at zero and cannot be purchased |
| TC-15 | API-13/14, UT-05 | First order starts PENDING, duplicate returns 409 |

| Additional targeted risk | Test references |
|---|---|
| Premium price and order amount | UT-01/02/06/11, API-08/13/19 |
| Recipe ownership | UT-04 and UI-01 |
| Paid entitlement transition | UT-08 and IT-07 |
| MongoDB persistence and schema boundary | IT-01 through IT-06 |
| Empty recipe lists, BUG-01 | API-21/22 |
| Payment confirmation, failure and recovery | ST-02 through ST-05 below |

Run `bash testing/validation/campaign.sh` for the post-fix regression. Security checks reuse API-05, API-07 and API-11. The two integration repeats and browser repeats test consistency. Historical manual screenshots, baseline reruns and repeat integration executions are excluded from the unique case count. See [final API results](13-Test-Results/API/newman.json) and [CI logs](13-Test-Results/CI/).

## Order state catalogue update

| State case | Status | Evidence or blocker |
|---|---|---|
| ST-01 | PASS | API-13 and IT-07 show eligible orders persist as PENDING |
| ST-02 | BLOCKED | IT-07 verifies the internal PAID transition. A provider confirmation endpoint or adapter is missing |
| ST-03 | BLOCKED | The FAILED enum exists. No implemented payment-failure transition is available |
| ST-04 | BLOCKED | No payment transition endpoint or rollback operation exposes this scenario for verification |
| ST-05 | BLOCKED | No FAILED recovery policy or authorized confirmation entry point can be exercised |
| ST-06 | PASS | API-14 returns 409 for the repeated order |
| ST-07 | PASS | IT-07 checks the premium preview before marking the order PAID |

The catalogued payment checks require an implemented provider or application transition boundary. The campaign used an internal service call only for IT-07. No external payment requests were sent.
