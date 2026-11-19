# Workshop 7 — MongoDB integration

Failsafe runs `RecipeMongoIT` in a Spring Boot MongoDB test slice. The test imports the real order and recipe services and uses actual Spring Data repositories. The campaign uses MongoDB 7 in a dedicated Docker container bound to loopback port 27031. Every JVM test run picks a new database name and every test picks fresh record IDs. Cleanup deletes only those records. The database and collections are never dropped by the test.

| ID | Scenario | Assertion |
|---|---|---|
| IT-01 | Insert | Document is present under the fixture ID |
| IT-02 | Retrieve | Ingredient, step, title and premium price round trip |
| IT-03 | Update | Fresh read returns updated title |
| IT-04 | Delete | Fresh read finds no record |
| IT-05 | Unique ID | Duplicate insert fails with DuplicateKeyException |
| IT-06 | Missing title via repository | MongoDB accepts the record, while API-09 proves application validation rejects it |
| IT-07 | Persisted PENDING to PAID | Service saves PAID and grants recipe access; PENDING keeps contents hidden |
| IT-08 | Configured buyer email index | Reject a duplicate email across two different buyer IDs |

IT-05 checks the built-in MongoDB `_id` index. IT-06 records the absence of a database title validator. Application DTO validation is a separate boundary. IT-07 simulates payment confirmation at the service boundary using disposable data. The repository has payment models but no runnable Stripe or payment confirmation endpoint.

Run `(cd backend && ./mvnw -Pvalidation clean verify)` and `(cd backend && ./mvnw -Pvalidation failsafe:integration-test failsafe:verify)`. See [both XML runs](../13-Test-Results/Integration/) and [repeat log](../13-Test-Results/CI/integration-repeat.log).

IT-08 opts into Spring Data automatic index creation within the isolated test slice. It verifies the inherited `@Indexed(unique=true)` annotation on the buyers collection. The application configuration does not enable automatic index creation, so the test does not establish deployment index provisioning or cross-collection uniqueness.
