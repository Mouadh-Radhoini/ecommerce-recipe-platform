# BUG-01 — Recipe API accepts empty ingredients or preparation steps

**Environment** — Kali Linux, Spring Boot 3.2.2 and isolated MongoDB 7.

**Steps**

1. Register a disposable chef using the Postman collection.
2. Submit API-21 with valid title, description and steps, and an empty ingredient array.
3. Submit API-22 with valid title, description and ingredients, and an empty step array.

**Expected** — Both requests return HTTP 400 with the rejected field in the validation response. The Angular recipe creation form already requires at least one ingredient and one step.

**Observed before repair** — Both requests returned HTTP 200 and passed through the creation handler. See the [redacted Newman export](../13-Test-Results/API/bug-01-before.json).

**Severity** — Medium. Chefs using the API could publish recipes that lacked usable instructions or ingredients.

**Priority** — High for this campaign because the creation API and browser form should enforce the same minimum content.

**Root cause and repair** — The request DTO used `@NotNull` for both lists, which permits empty arrays. Both fields now use `@NotEmpty`.

**Regression tests** — API-21 and API-22. See [final Newman results](../13-Test-Results/API/newman.json).
