# Workshop 9 — Browser testing

UI-01 registers one disposable chef through the API as setup. In Chromium it opens Angular, logs in through the page, navigates to My Recipes, fills and submits the recipe form, checks the detail page after reload, logs out, and confirms direct navigation to the protected creation page redirects to login.

The [specification](../../frontend/e2e/chef-journey.spec.cjs), [Page Objects](../../frontend/e2e/page-objects/recipe-journey.cjs) and [configuration](../../frontend/e2e/playwright.config.cjs) use role and label selectors with Playwright's waiting assertions. The current Angular worktree already provides the form. Each of the two repetitions uses fresh data.

See [HTML evidence](../13-Test-Results/UI/html/index.html), [JUnit XML](../13-Test-Results/UI/junit.xml) and [screenshots](../13-Test-Results/Screenshots/). Playwright retains failure traces locally. These archives can contain fixture secrets and are excluded from submission and CI upload.

The [anonymous route-guard trace](../13-Test-Results/UI/anonymous-route-guard.zip) records a separate fresh-context replay without credentials. It covers the redirect to sign-in, while the main HTML report and screenshots cover the authenticated journey.
