# Test plan
## Objectives and strategy

Validate role checks, input boundaries, critical business rules and persistence. Collect reproducible evidence at multiple levels. Evaluate local release readiness and document blocked payment-provider checks.

| Level | Method and tools | Scope |
|---|---|---|
| Unit | JUnit 5, Mockito, AssertJ, Angular Vitest | Pricing, auth rules, pending orders, premium entitlement and app shell |
| Integration | Spring Boot MongoDB test slice and Maven Failsafe | CRUD, MongoDB ID and configured email uniqueness, paid state persistence |
| System | Newman and Playwright | Buyer/chef API contract and genuine chef publication journey |
| Acceptance and quality | k6, SpotBugs, JaCoCo, npm audit, manual evidence review | Listing load, dependency findings, repeatability and release criteria |

Environment uses Kali Linux, local JDK 21 targeting Java 17, Node 24, Chromium, temporary app ports and MongoDB 7 running in a dedicated container. The live campaign generates fresh users, signing material and a uniquely named database. The integration suite deletes only its own fixture IDs. Real payment services are outside scope.

| Criterion | Evidence required |
|---|---|
| Entry | Traceable requirements, executable build, isolated data and reachable local stack |
| Exit, automation | 15 documented cases, at least 5 unit and 3 integration cases, API collection, repeated UI journey, non-functional run and reproducible evidence |
| Exit, release | Critical security and purchase cases pass, including applicable payment-boundary tests, and critical findings receive a disposition |
| Exit, reporting | Regression rerun, coverage, static analysis and defect evidence accurately archived |

Work sequence: establish baseline and risk priorities, implement automated test layers, isolate failures, fix confirmed defects, rerun the highest-risk cases and archive actual results. Priority is auth, authorization, premium entitlement, order rules and persistence. The student owns test fixtures, runs, evidence and the oral defense. The professor reviews deliverables and the validation decision. Local CI simulates hosted execution using the same campaign entry point. The dossier consists of reports 01–14, automation sources and raw evidence.
