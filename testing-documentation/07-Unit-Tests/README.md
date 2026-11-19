# Workshop 6 — Automated unit tests

JUnit 5, Mockito and AssertJ exercise the service layer with isolated repositories, an encoder and a token service. Each method gets fresh mocks and fixtures. Run `(cd backend && ./mvnw -Dtest=BusinessRulesTest test)`.

| ID | Method | Expected outcome |
|---|---|---|
| UT-01 | freeRecipeIgnoresSubmittedPrice | Persist free recipe at price zero with the chef ID |
| UT-02 | premiumRecipeKeepsPositivePrice | Preserve submitted positive price |
| UT-03 | freeRecipeCannotBeOrdered | Return 400 before order persistence |
| UT-04 | ownerCannotOrderOwnRecipe | Return 403 at the service boundary |
| UT-05 | existingPendingOrderPreventsDuplicate | Return 409 without another insert |
| UT-06 | newOrderPersistsPendingStatusAndRecipePrice | Persist PENDING with buyer, recipe and amount |
| UT-07 | pendingOrderDoesNotUnlockPremium | Deny access while PENDING |
| UT-08 | paidOrderUnlocksPremium | Grant access when PAID |
| UT-09 | duplicateRegistrationDoesNotPersistUser | Return 409 before encoding or issuing JWT |
| UT-10 | incorrectPasswordDoesNotIssueToken | Return 401 and issue no JWT |
| UT-11 | premiumRecipeRejectsZeroPrice | Return 400 before saving a premium recipe |
| UT-12 | validLoginReturnsBuyerIdentityAndToken | Return the expected buyer identity and token with the BUYER authority |

The ownership rule is tested directly because the HTTP order endpoint already requires BUYER. An existing Spring context smoke test runs separately in Surefire. See [unit XML](../13-Test-Results/Unit/) and [Maven output](../13-Test-Results/CI/backend-verify.log).
