# Browser test report

**Result:** UI-01 passed in both consecutive Chromium executions. Each repetition provisions a unique chef fixture with the API and then signs in through the Angular form. Publication itself happens through the browser form. Recipe detail is verified after page reload. Logout and direct navigation to a protected route confirm that the session is cleared.

The Login, Recipe List and Recipe Creation Page Objects use accessible labels and visible roles. Assertions use Playwright auto-waiting. The successful executions produced two publication screenshots. Traces are retained upon failure only. This campaign has no retained failure trace. A separate fresh-context replay captured the anonymous route guard without logging in. The trace corroborates the guard and is outside the distinct case count.

| Execution | Scenario | Verdict |
|---|---|---|
| 1 | Login, publish, reload and verify, logout and verify guard | PASS |
| 2 | Same journey with a fresh account and recipe | PASS |

[HTML report](../13-Test-Results/UI/html/index.html) · [JUnit XML](../13-Test-Results/UI/junit.xml) · [Screenshots](../13-Test-Results/Screenshots/) · [Anonymous route-guard trace](../13-Test-Results/UI/anonymous-route-guard.zip) · [Canonical source](../../frontend/e2e/chef-journey.spec.cjs)
