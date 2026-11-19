# MongoDB integration test report

**Result:** 8 passed, 0 failed, 0 skipped in each of two independent executions. A dedicated MongoDB 7 container listens on loopback port 27031. Each JVM uses a random database name and the tests clean up only the fixture IDs they created.

| Area | Verification |
|---|---|
| CRUD | Insert a recipe, retrieve its fields, change its title, delete it, and verify absence using a fresh query |
| Integrity 1 | MongoDB rejects duplicate primary keys |
| Integrity 2 | The configured buyer email index rejects different buyer IDs that share the same email |
| Validation boundary | Direct persistence accepts a missing title. The HTTP layer rejects invalid titles through Bean Validation |
| Paid access | A real PENDING order becomes PAID after the internal service method. The entitlement changes with persisted state |

IT-08 enables automatic index creation only in the test slice. This demonstrates that the declared email index works when provisioned. No deployment-level or across-collection uniqueness is established by that experiment. IT-07 uses an internal call with disposable data.

| Executed test method | Status |
|---|---|
| `configuredUniqueBuyerEmailIndexRejectsDuplicate` | PASS |
| `insertsAndReadsFromMongo` | PASS |
| `persistsChangedTitle` | PASS |
| `markingPersistedOrderPaidUnlocksRecipe` | PASS |
| `databaseAllowsMissingTitleWithoutDtoValidation` | PASS |
| `rejectsDuplicateMongoId` | PASS |
| `deletesExistingFixture` | PASS |
| `roundTripsRecipeFields` | PASS |

[First and second Failsafe XML runs](../13-Test-Results/Integration/) · [Build log](../13-Test-Results/CI/backend-verify.log) · [Repeat log](../13-Test-Results/CI/integration-repeat.log)
