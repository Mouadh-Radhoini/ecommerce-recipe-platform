# Ten-minute defense script

Start the isolated stack before the defense. Open the final report, the Playwright HTML report and the JaCoCo index. Keep the saved Newman output ready for the security and defect examples.

| Elapsed time | Slide | Speaking points and demonstration |
|---|---|---|
| 0:00–0:40 | 1 · Project | “Chefs publish recipes. Buyers browse, and an order controls access to premium instructions. I tested whether the application follows those rules and whether there is enough evidence to release it.” |
| 0:40–1:25 | 2 · Architecture | Follow one request from Angular to Spring Security, then to a service and MongoDB. Explain JWT as the credential carried with the request. Explain why the same protected URL can yield different results depending on role or ownership. |
| 1:25–2:10 | 3 · Requirements | Walk through the chef-only rule and the unpaid preview rule. Point out that preview is HTTP 200 with hidden fields. Explain how the matrix traces an observable result to a test ID. |
| 2:10–2:55 | 4 · Risks | Show premium leakage, invalid orders and missing provider confirmation. Explain the probability × impact ranking and why payment remains a release risk despite the internal PAID test. |
| 2:55–3:40 | 5 · Strategy | Connect Mockito, isolated MongoDB, Newman, Playwright and k6 to different kinds of test evidence. Mention fresh fixtures and the 14-stage local CI run. |
| 3:40–4:25 | 6 · Test design | Show the two password boundary cases and the recipe role decision table. Walk through the solid PENDING-to-PAID arrow and the proposed FAILED path. |
| 4:25–5:15 | 7 · Unit tests | Open `BusinessRulesTest.validLoginReturnsBuyerIdentityAndToken`. Identify the repository and encoder arrangements, the service call, and the identity and role assertions. Show the 12-case Surefire result. |
| 5:15–6:05 | 8 · Integration | Open the Failsafe result. Explain the duplicate buyer email test and the test-slice index configuration. Use IT-07 to show how persisted order status and visible content change together. |
| 6:05–7:00 | 9 · API and defect | Run `curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:18084/api/recipes` and point out 401. Show API-07 and API-23 in the saved Newman export. Compare API-21/22 returning 200 before the fix and 400 after it. |
| 7:00–8:00 | 10 · Browser and load | Open the genuine post-reload recipe screenshot and show both Playwright repetitions. Describe the 10-VU workload and give p95 for both runs. Explain that the workload uses a small isolated database. |
| 8:00–9:00 | 11 · Results and coverage | Show 48 executed and passed, 4 blocked, and 52 planned. Open JaCoCo and point to 57.02% lines and 54.17% branches. Explain that Java unit and integration tests contributed to those counts. |
| 9:00–10:00 | 12 · Decision | State “NOT VALIDATED for release.” Explain the blocked payment paths, dependency findings and unexecuted hosted workflow. Close with what the evidence establishes for the university demonstration. |

Optional live unit command:

```bash
(cd backend && ./mvnw -Dtest=BusinessRulesTest#validLoginReturnsBuyerIdentityAndToken test)
```

See [reproduction commands](HOW-TO-RUN-TESTS.md), [final PDF](testing-documentation/14-Final-Report.pdf) and [slide deck](presentation.pptx).
