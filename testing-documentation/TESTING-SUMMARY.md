# Testing summary

**NOT VALIDATED for release.** Four payment-boundary checks remain blocked and dependency findings remain open.

| Test Category | Planned | Passed | Failed | Blocked | Not Executed | Evidence |
|---|---:|---:|---:|---:|---:|---|
| Backend business unit | 12 | 12 | 0 | 0 | 0 | [Surefire](13-Test-Results/Unit/) |
| Spring context smoke | 1 | 1 | 0 | 0 | 0 | [Surefire](13-Test-Results/Unit/) |
| MongoDB integration | 8 | 8 | 0 | 0 | 0 | [Two repeats](13-Test-Results/Integration/) |
| Angular unit | 2 | 2 | 0 | 0 | 0 | [Vitest](13-Test-Results/CI/frontend-test.log) |
| Newman API | 23 | 23 | 0 | 0 | 0 | [Newman JSON](13-Test-Results/API/newman.json) |
| Browser journey | 1 | 1 | 0 | 0 | 0 | [Playwright HTML](13-Test-Results/UI/html/index.html) |
| k6 campaign | 1 | 1 | 0 | 0 | 0 | [k6 summaries](13-Test-Results/Performance/) |
| Payment-boundary cases | 4 | 0 | 0 | 4 | 0 | [ST-02–05](TRACEABILITY-AND-REGRESSION.md#order-state-catalogue-update) |
| **Total** | **52** | **48** | **0** | **4** | **0** | [Local CI](13-Test-Results/CI/exit-codes.tsv) |

48 distinct executed cases passed (48/48, 100%). The campaign completed 48/52 planned cases (92.31%). Repeated runs, security aliases and mapped catalogue cases share underlying evidence and are counted once. Hosted CI and the unscripted exploratory session were not executed and sit outside the automated case denominator.

[Final campaign report](14-Final-Report.pdf) · [Run guide](../HOW-TO-RUN-TESTS.md)
