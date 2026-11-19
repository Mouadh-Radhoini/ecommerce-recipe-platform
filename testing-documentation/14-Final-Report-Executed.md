# Final testing campaign report
## E-commerce Recipe Platform

**Mouadh Radhoini · Institut Supérieur des Études Technologiques de Mahdia**  
**Test host date:** 19 November 2026 · **Worktree:** test-validation, base 4a570db  
**Decision:** **NOT VALIDATED for release**

### 1. Executive summary
The final local campaign passed 48 executed cases out of 52 planned. Four payment-boundary tests were blocked. One reproduced API validation defect was fixed and retested.

### 2. Application
Angular 21 calls a Spring Boot 3.2.2 REST API. Spring Security authenticates JWTs and checks BUYER and CHEF roles. Spring Data persists records in MongoDB.

### 3. Objectives
Verify authentication and authorization, recipe publication, pricing, order state rules and persisted entitlement. Collect repeatable evidence for the university mini-project.

### 4. Scope
The campaign includes the core API, the chef publication journey and local listing performance. Provider callbacks, real charges, broad comment and follow behavior, and cross-browser testing remain outside executed scope.

### 5. Requirements and risks
Ten requirements trace to role, data, recipe, order and UI risks. R-05 (payment outcome) and R-10 (dependencies) are open. The professor's twelve guides and the mini-project brief were reviewed. The internship report informed historical context.

### 6. Test plan
JUnit, Spring Boot, Newman, Playwright, k6, SpotBugs and JaCoCo ran locally. Tests used disposable fixture accounts and a dedicated MongoDB container. The final verification reran high-priority checks after a reported defect and updates to the test suite.

### 7. Test catalogue and execution

| Test Category | Planned | Passed | Failed | Blocked | Not Executed |
|---|---:|---:|---:|---:|---: |
| Backend business unit | 12 | 12 | 0 | 0 | 0 |
| Spring context smoke | 1 | 1 | 0 | 0 | 0 |
| MongoDB integration | 8 | 8 | 0 | 0 | 0 |
| Angular unit | 2 | 2 | 0 | 0 | 0 |
| Newman API | 23 | 23 | 0 | 0 | 0 |
| Browser journey | 1 | 1 | 0 | 0 | 0 |
| k6 campaign | 1 | 1 | 0 | 0 | 0 |
| Payment-boundary cases | 4 | 0 | 0 | 4 | 0 |
| **Total** | **52** | **48** | **0** | **4** | **0** |

The detailed category table is in TESTING-SUMMARY.md. The black-box catalogue contains 18 entries with preconditions, data, expected and observed outcomes, and evidence IDs. 48 distinct executed cases passed (48/48, 100%). The campaign completed 48/52 planned cases (92.31%). Repeated runs, security aliases and mapped catalogue cases share underlying evidence and are counted once. Hosted CI and the unscripted exploratory session were not executed and sit outside the automated case denominator.

### 8. Unit tests
All 12 business unit cases passed. A separate Spring context test and both Angular unit cases also passed. Mockito checked successful and failed authentication, pricing, restrictions and entitlement.

### 9. Integration tests
Eight cases passed on both runs. CRUD, duplicate primary key and configured buyer email uniqueness were verified against MongoDB. The change from PENDING to PAID unlocked a stored premium recipe. The test opts into automatic index creation. A production index rollout remains unverified.

### 10. API tests
Newman passed 23 scenarios and 46 assertions. It covered both roles, authentication, validation, premium and order rules. Malformed JWT and missing JWT both return 401, with different response bodies verified by assertions.

### 11. UI tests
Two Playwright runs passed using separate chef accounts. The browser created the recipe, retrieved it after reload, logged out and returned to login when navigating to a protected route. Screenshots and the HTML report are archived.

### 12. Performance

| Run | Listings | All HTTP requests | Listings/s | Mean | p95 | Listing error rate | Status |
|---|---:|---:|---:|---:|---:|---:|---|
| 1 | 930 | 931 | 91.71 | 7.08 ms | 12.86 ms | 0.00% | PASS |
| 2 | 940 | 941 | 92.68 | 5.98 ms | 8.64 ms | 0.00% | PASS |

### 13. Security
Four API checks verify missing JWT denial, invalid JWT denial, buyer publication denial and protected premium content. No real payment or external target was used.

### 14. Defects
BUG-01 was medium severity, high priority. Recipe creation accepted empty list payloads. Both cases returned 400 after the DTO fix. There are zero open confirmed application defects. Dependency triage tracks two critical toolchain groups and one high runtime group.

### 15. Coverage and static analysis

| Scope | Line | Branch | Instruction |
|---|---:|---:|---:|
| Backend overall | 199/349 (57.02%) | 26/48 (54.17%) | 700/1345 (52.04%) |
| AuthService | 26/44 (59.09%) | 5/12 (41.67%) | 104/208 (50.00%) |
| RecipeService | 38/42 (90.48%) | 15/20 (75.00%) | 164/186 (88.17%) |
| OrderService | 26/29 (89.66%) | 4/4 (100.00%) | 98/123 (79.67%) |
| RecipeAccessService | 6/6 (100.00%) | 2/2 (100.00%) | 23/23 (100.00%) |

Coverage measures unit and integration JVM execution. Newman and Playwright ran in their own application process. SpotBugs recorded 17 priority-2 findings with zero analysis errors. Positive registration, error branches and untested modules warrant further coverage.

### 16. Regression
The final regression included authentication, buyer and chef role separation, order rules, pricing, persistence, and API-21/22. The initial assertion mismatch on API-23 is retained as test development evidence.

### 17. CI
All 14 local CI stages returned zero. The hosted GitHub Actions workflow is configured. Hosted execution remains NOT EXECUTED.

### 18. Limitations
The dataset and run time are small and Chromium is the only browser tested. The provider payment boundary, the unscripted exploratory session and the hosted workflow have no execution evidence.

### 19. Residual risk
Provider confirmation, failure handling and authorization of rollback or recovery remain blocked. Release also depends on resolving or formally accepting dependency findings and confirming index provisioning.

### 20. Decision
**NOT VALIDATED for release.** Entry criteria and automation minimums were met. Exit criteria requiring applicable critical payment tests and dependency disposition remain unmet.

### 21. Recommendations
Implement and exercise provider confirmation and failure handling in a sandbox. Verify deployment index provisioning. Review dependency patches and add targeted coverage for authentication and exception paths.

### 22. Conclusion
The submission demonstrates a reproducible test campaign for the implemented platform and a release decision based on recorded results. The evidence is indexed in 13-Test-Results/README.md. The executable workflow is described in HOW-TO-RUN-TESTS.md.
