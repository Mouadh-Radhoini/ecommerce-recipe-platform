# Final regression run

| Risk | Selected tests | Final evidence |
|---|---|---|
| Authentication and session guards | UT-09/10/12, API-01–06/23, UI-01 | [Unit XML](../Unit/), [Newman JSON](../API/newman.json), [Playwright](../UI/html/index.html) |
| Validation defect | API-21/22 | [Before fix](../API/bug-01-before.json), [post-fix run](../API/newman.json) |
| Pricing and orders | UT-01–06/11, API-08/13–15/19/20 | [Unit XML](../Unit/), [Newman JSON](../API/newman.json) |
| Premium entitlement and durability | UT-07/08, API-11, IT-01–08 | [Unit XML](../Unit/), [two integration runs](../Integration/) |

See [local exit codes](../CI/exit-codes.tsv) and [traceability](../../TRACEABILITY-AND-REGRESSION.md). The initial invalid-JWT assertion expected the wrong response body. Its draft output remains available as test development evidence. The final scenario asserts the API's JSON error string.
