# Execution evidence

| Folder | Contents |
|---|---|
| Unit | Surefire XML for service tests and existing context smoke test |
| Integration | Failsafe XML for two independent runs |
| API | Initial smoke collection, pre-fix BUG-01 results, and final Newman export |
| UI | Playwright JUnit XML, HTML report, browser screenshots and anonymous route-guard trace |
| Screenshots | Current Playwright publication screenshots |
| Performance | k6 summaries with fixture setup data removed |
| Coverage | JaCoCo site, XML and CSV |
| Logs | Maven baseline, SpotBugs, npm audit and historical text evidence |
| CI | Local pipeline stdout/stderr and stage exit codes |
| Regression | Risk-selected tests, local stage codes and post-fix evidence |

The legacy lowercase `screenshots/` folder contains the supplied manual evidence. Its registration screenshot has the disposable fixture password covered. Final evidence comes from the automated campaign. Failed browser traces, when generated, stay local because they can contain fixture credentials.
