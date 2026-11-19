# Software Testing and Validation dossier

**E-commerce Recipe Platform · Mouadh Radhoini · ISET Mahdia**

Start with the [final report](14-Final-Report.pdf) and [execution summary](TESTING-SUMMARY.md). The final campaign passed 48 of 48 executed cases. Four payment-boundary cases were blocked. The release decision is **NOT VALIDATED**.

| Workshop | Deliverable | Final evidence |
|---|---|---|
| 1 | [Project overview](01-Project-Overview.pdf) and [risk analysis](02-Risk-Analysis.pdf) | Source review and historical internship reference |
| 2 | [Test plan](03-Test-Plan.pdf) | [Verified local environment](ENVIRONMENT-VERIFICATION.md) |
| 3 | [Requirements matrix](04-Requirements-Matrix.pdf) | [Traceability](TRACEABILITY-AND-REGRESSION.md) |
| 4 | [18 black-box cases](05-Test-Cases.pdf) | [Newman scenarios](13-Test-Results/API/newman.json) |
| 5 | [Order diagram and state cases](06-State-Diagram.pdf) | [State traceability](TRACEABILITY-AND-REGRESSION.md#order-state-catalogue-update) |
| 6 | [Unit report](07-Unit-Tests/Unit-Test-Report.pdf) | [Surefire XML](13-Test-Results/Unit/) |
| 7 | [Integration report](08-Integration-Tests/Integration-Test-Report.pdf) | [Two Failsafe XML runs](13-Test-Results/Integration/) |
| 8 | [API report](09-Postman/API-Test-Report.pdf) | [Newman results](13-Test-Results/API/newman.json) |
| 9 | [UI report](10-UI-Tests/UI-Test-Report.pdf) | [Playwright HTML](13-Test-Results/UI/html/index.html) |
| 10 | [Non-functional report](11-Performance/Non-Functional-Test-Report.pdf) | [k6 results](13-Test-Results/Performance/) |
| 11 | [Bug register](12-Bug-Reports/Bug-Register.pdf) and [static analysis](12-Bug-Reports/STATIC-ANALYSIS.md) | [Coverage](13-Test-Results/Coverage/index.html) and [regression](13-Test-Results/Regression/README.md) |
| 12 | [Final report](14-Final-Report.pdf) | [Local CI stage results](13-Test-Results/CI/exit-codes.tsv) |

Workshop evidence folders link to canonical artifacts under [13-Test-Results](13-Test-Results/README.md). This gives each result one authoritative copy. The authored source for reports 01–06 is in [sources](sources/). Later reports have Markdown sources beside their PDFs. The baseline academic PDFs are preserved in [archive](archive/). The local university and internship references are listed in [REFERENCES.md](REFERENCES.md).

## Reproduction and presentation

The package includes the application and canonical test sources in their repository-relative locations. Use the extracted package root as the execution root.

- Java JUnit and MongoDB tests are under `backend/src/test/java/com/mouadh/backend/`.
- Angular unit tests are under `frontend/src/app/`. Playwright is under `frontend/e2e/`.
- The Postman and k6 examples are packaged with workshop 8 and workshop 10.
- Newman, local CI and export tools live under `testing/validation/`. The hosted definition is `.github/workflows/validation.yml`.
- The [run guide](../HOW-TO-RUN-TESTS.md), [slide deck](../presentation.pptx), and [10-minute script](../PRESENTATION-DEMO.md) accompany the evidence.

The ZIP includes the application sources and lockfiles. Install dependencies and start the dedicated MongoDB instance before rerunning.
