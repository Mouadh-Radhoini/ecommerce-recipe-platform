# Environment verification

| Component | Observed configuration or result |
|---|---|
| Worktree | `test-validation`, base commit `4a570db`, with application and document edits present at campaign start |
| Platform | Kali Linux, x86-64 |
| Java | OpenJDK 21.0.13 for the final local campaign. The backend compiles for Java 17, which the hosted workflow selects |
| Maven | Wrapper 3.9.12 |
| Backend | Spring Boot 3.2.2. Baseline clean test and final clean verify passed |
| Frontend | Angular 21, Node 24.21.0 and npm 12.2.0. Locked install, production build and both Vitest cases passed |
| Database | Fresh Docker MongoDB 7 container published on 127.0.0.1:27031. Failsafe confirmed real connection and persistence |
| Tools | Newman 6.2.2, Playwright 1.58.2 with system Chromium, k6 1.4.2, JaCoCo 0.8.14 and SpotBugs plugin 4.9.3.0 |

The active worktree branch, initial diff, status and archive of untracked files were preserved before modifications. The original academic PDFs remain available. The internship report, 12 workshop guides, and mini-project brief were subsequently found in Downloads and reviewed. See [References](REFERENCES.md) for the mapping.

Spring Security admits registration and login anonymously, enforces authentication on remaining routes, and applies role checks through method security. The campaign configured an ephemeral JWT signing key and isolated MongoDB URIs. The API tests exercised `/api/auth`, `/api/recipes` and `/api/orders`; the source also exposes profile, comment, follow and notification endpoints.

The current Angular source includes a working chef creation form, browsing, profile, order list and checkout review. The checkout UI creates a pending order and explicitly reports that payment processing is unavailable. Current Spring Boot source has payment models and a repository and provides no payment checkout or webhook controller.

Port 18081 already had a listener. The campaign used fresh loopback service ports and a unique validation database. The reproduction collection still defaults to 18081 when available. SpotBugs initially failed on Java 25 library classes with unsupported class-file major version 69. It ran successfully with JDK 21. See [baseline logs](13-Test-Results/Logs/) and [final stage codes](13-Test-Results/CI/exit-codes.tsv).
