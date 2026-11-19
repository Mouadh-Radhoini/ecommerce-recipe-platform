# Unit test report

**Result:** 12 passed, 0 failed, 0 skipped. The separate Spring context smoke test also passed. JUnit 5, Mockito and AssertJ ran through Maven Surefire. Each case creates its own fixtures and mock interactions.

Arrange–Act–Assert example: set up the buyer repository, password encoder and token service for a valid login. Call AuthService.login. Assert the returned token, buyer ID, email and role. Verify the chef repository was never used. Authentication persistence, password hashing and JWT validation against actual services are checked by the separate API layer.

| Executed test method | Status |
|---|---|
| `existingPendingOrderPreventsDuplicate` | PASS |
| `freeRecipeCannotBeOrdered` | PASS |
| `premiumRecipeKeepsPositivePrice` | PASS |
| `newOrderPersistsPendingStatusAndRecipePrice` | PASS |
| `validLoginReturnsBuyerIdentityAndToken` | PASS |
| `pendingOrderDoesNotUnlockPremium` | PASS |
| `ownerCannotOrderOwnRecipe` | PASS |
| `incorrectPasswordDoesNotIssueToken` | PASS |
| `freeRecipeIgnoresSubmittedPrice` | PASS |
| `paidOrderUnlocksPremium` | PASS |
| `duplicateRegistrationDoesNotPersistUser` | PASS |
| `premiumRecipeRejectsZeroPrice` | PASS |

Run `(cd backend && ./mvnw -Dtest=BusinessRulesTest test)`. The [test source](../../backend/src/test/java/com/mouadh/backend/service/BusinessRulesTest.java) is canonical. See [Surefire XML](../13-Test-Results/Unit/) and [Maven log](../13-Test-Results/CI/backend-verify.log).
