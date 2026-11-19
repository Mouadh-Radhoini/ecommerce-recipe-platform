# Risk analysis

Risks were identified by tracing requests from Angular to controllers, services and MongoDB, then reviewing incorrect input, role boundaries and payment-state failure modes. Probability and impact use a 1–3 scale from low to high. Score = probability × impact. Scores of 6–9 are high, 3–4 medium, and 1–2 low. Scores represent planning judgments.

| Risk | Function and failure | P | I | Score | Mitigation and trace |
|---|---|---:|---:|---|---|
| R-01 | Authentication accepts absent or invalid JWT | 2 | 3 | 6 High | BR-02/10. API-05/06/23 assert deny, allow, deny |
| R-02 | Buyer publishes chef content | 2 | 3 | 6 High | BR-03. API-07/08 verify both roles |
| R-03 | Unpaid user receives premium instructions | 3 | 3 | 9 High | BR-05. API-11 and IT-07 verify redaction and paid entitlement |
| R-04 | Buyer orders free or duplicate recipe | 2 | 3 | 6 High | BR-06. UT-03–06 and API-13/14/20 exercise restrictions |
| R-05 | Provider outcome and paid status diverge | 3 | 3 | 9 High | BR-06. IT-07 verifies internal transition. Provider-boundary ST-02–05 remain blocked |
| R-06 | Persistence loses data or accepts duplicates | 2 | 3 | 6 High | BR-07. IT-01–06/08 use isolated MongoDB and exercise two unique indexes |
| R-07 | API accepts malformed input | 2 | 2 | 4 Medium | BR-01/03/04/09. API-09/16–22 and BUG-01 |
| R-08 | Chef cannot complete publication through UI | 3 | 2 | 6 High | BR-08. UI-01 twice with fresh data |
| R-09 | Regression evidence cannot be reproduced | 3 | 3 | 9 High | All BRs. Pin tooling and archive local CI stage results |
| R-10 | Runtime and development dependencies carry advisories | 2 | 3 | 6 High | Review DEP-01–03 and compare runtime and full audit scopes |

R-05 and R-10 remain release risks. R-06 includes deployment index provisioning risk. IT-08 proves behavior when index creation is configured. The default application configuration does not establish automatic index provisioning.
