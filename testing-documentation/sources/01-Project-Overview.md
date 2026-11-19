# Project overview
## E-commerce Recipe Platform

The platform lets chefs publish recipes and buyers discover free and premium content. Its business goals are to make recipes discoverable, preserve author ownership, and represent premium purchase and access consistently.

| Layer | Current implementation |
|---|---|
| Browser | Angular 21 and TypeScript render authentication, recipe discovery, chef publishing, orders and profile views |
| API | Spring Boot 3.2.2, Java 17 target, Spring Security and JWT. Stateless authentication and role checks guard API routes |
| Rules | AuthService authenticates users. RecipeService prices and projects recipes. OrderService validates purchases. RecipeAccessService checks persisted entitlement |
| Data | Spring Data MongoDB stores role records, recipes, orders, comments, follows, notifications and payment models |
| Quality tooling | Maven, JUnit, Mockito, Spring Boot Test, Newman, Playwright, k6, JaCoCo and SpotBugs |

| Actor | Available actions | Constraints |
|---|---|---|
| Visitor | Register and sign in | Protected API routes require JWT |
| BUYER | Browse, view free content, open pending premium orders and view own orders | Cannot publish. Unpaid premium detail withholds ingredients and steps |
| CHEF | Publish, browse and see owned recipe details | Chef role required for publishing. Order endpoint requires BUYER |
| Internal service | Mark a persisted order PAID | No payment provider confirmation endpoint is exposed |

Free recipes store zero price, premium recipes require a positive finite price, duplicate and free purchases are rejected, and a new order starts PENDING. The current recipe form and pending-order checkout are implemented. Comment, follow and notification controllers exist, with broad functional coverage outside this campaign. Payment records and internal paid access exist, while provider checkout, failure transitions and webhook-based confirmation are outstanding.

The internship report is historical. It documents the earlier authentication and persistence implementation. The current worktree supplies the executable contract. The campaign covers authentication, authorization, recipe publication and validation, MongoDB CRUD, order rules, premium access and a light listing load.
