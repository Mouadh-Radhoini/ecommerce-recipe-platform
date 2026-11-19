# Test case catalogue

Run the collection in order on the isolated backend. The Newman pre-request script creates disposable IDs and credentials and the authentication steps populate later prerequisites. The evidence for every API case is in `13-Test-Results/API/newman.json`. A dash in the defect field means no linked defect.

| Design method | Partitions or boundary | Cases |
|---|---|---|
| Equivalence | Valid, missing and malformed bearer | TC-01/04/16 |
| Equivalence | Valid input, malformed email, blank title and empty lists | TC-02/06/11/12/17/18 |
| Boundary | 7 characters rejected and 8 accepted | TC-08/09 |
| Boundary | Zero premium price rejected, positive price preserved | UT-11/02 |
| Decision table | Role and validity determine publication | Below |

| JWT | Role | Payload | Expected |
|---|---|---|---|
| Missing or malformed | Any | Any | Access denied |
| Valid | BUYER | Valid | 403 |
| Valid | CHEF | Blank title or empty content lists | 400 |
| Valid | CHEF | Valid | HTTP 200 and new record |

| Premium | Existing order | Decision |
|---|---|---|
| No | Any | Reject purchase |
| Yes | None | Create PENDING |
| Yes | PENDING or PAID | Reject duplicate |
| Yes | PENDING or none | Hide premium content |
| Yes | PAID | Grant buyer content access |

## Detailed cases

### TC-01 · Anonymous listing

**Requirement:** BR-02. **Preconditions and test data:** No authentication.  
**Steps:** GET /api/recipes without header. Record the HTTP status and evaluate the collection assertions.  
**Expected:** 401, empty response. **Actual:** 401, empty response.  
**Status:** PASS. **Evidence:** Newman API-05. **Defect:** —.

### TC-02 · Register buyer

**Requirement:** BR-01. **Preconditions and test data:** Unused email, valid name and password.  
**Steps:** POST /api/auth/register/buyer. Record the HTTP status and evaluate the collection assertions.  
**Expected:** 200 and BUYER identity with JWT. **Actual:** 200, identity and JWT verified.  
**Status:** PASS. **Evidence:** Newman API-01. **Defect:** —.

### TC-03 · Sign in

**Requirement:** BR-10. **Preconditions and test data:** Existing buyer, matching password.  
**Steps:** POST /api/auth/login. Record the HTTP status and evaluate the collection assertions.  
**Expected:** 200 and authenticated buyer identity. **Actual:** 200, buyer and JWT verified.  
**Status:** PASS. **Evidence:** Newman API-03. **Defect:** —.

### TC-04 · Authenticated listing

**Requirement:** BR-02. **Preconditions and test data:** JWT from buyer login.  
**Steps:** GET /api/recipes with bearer. Record the HTTP status and evaluate the collection assertions.  
**Expected:** 200 JSON array. **Actual:** 200 JSON array.  
**Status:** PASS. **Evidence:** Newman API-06. **Defect:** —.

### TC-05 · Wrong password

**Requirement:** BR-10. **Preconditions and test data:** Existing buyer and incorrect password of valid length.  
**Steps:** POST /api/auth/login. Record the HTTP status and evaluate the collection assertions.  
**Expected:** 401 invalid credentials. **Actual:** 401, error verified.  
**Status:** PASS. **Evidence:** Newman API-04. **Defect:** —.

### TC-06 · Malformed email

**Requirement:** BR-01. **Preconditions and test data:** New buyer fixture with invalid-address.  
**Steps:** POST /api/auth/register/buyer. Record the HTTP status and evaluate the collection assertions.  
**Expected:** 400 email validation error. **Actual:** 400, email field verified.  
**Status:** PASS. **Evidence:** Newman API-16. **Defect:** —.

### TC-07 · Duplicate email

**Requirement:** BR-01. **Preconditions and test data:** Email already registered as buyer.  
**Steps:** POST /api/auth/register/chef with that email. Record the HTTP status and evaluate the collection assertions.  
**Expected:** 409 duplicate email. **Actual:** 409, duplicate error verified.  
**Status:** PASS. **Evidence:** Newman API-12. **Defect:** —.

### TC-08 · Below password boundary

**Requirement:** BR-09. **Preconditions and test data:** Unused email and Pass123.  
**Steps:** POST /api/auth/register/buyer. Record the HTTP status and evaluate the collection assertions.  
**Expected:** 400 password validation error. **Actual:** 400, password field verified.  
**Status:** PASS. **Evidence:** Newman API-17. **Defect:** —.

### TC-09 · At password boundary

**Requirement:** BR-09. **Preconditions and test data:** Unused email and Pass1234.  
**Steps:** POST /api/auth/register/buyer. Record the HTTP status and evaluate the collection assertions.  
**Expected:** 200 buyer created. **Actual:** 200, buyer and JWT verified.  
**Status:** PASS. **Evidence:** Newman API-18. **Defect:** —.

### TC-10 · Buyer publish denial

**Requirement:** BR-03. **Preconditions and test data:** Buyer JWT and valid recipe.  
**Steps:** POST /api/recipes. Record the HTTP status and evaluate the collection assertions.  
**Expected:** 403, empty response. **Actual:** 403, empty response.  
**Status:** PASS. **Evidence:** Newman API-07. **Defect:** —.

### TC-11 · Chef publishes recipe

**Requirement:** BR-03. **Preconditions and test data:** Chef JWT, title, ingredient and step arrays, price 4.25.  
**Steps:** POST /api/recipes. Record the HTTP status and evaluate the collection assertions.  
**Expected:** 200, premium recipe and ID returned. **Actual:** 200, ID, title, price and steps verified.  
**Status:** PASS. **Evidence:** Newman API-08. **Defect:** —.

### TC-12 · Blank recipe title

**Requirement:** BR-03. **Preconditions and test data:** Chef JWT, whitespace title, remaining fields valid.  
**Steps:** POST /api/recipes. Record the HTTP status and evaluate the collection assertions.  
**Expected:** 400 with title error. **Actual:** 400, title validation verified.  
**Status:** PASS. **Evidence:** Newman API-09. **Defect:** —.

### TC-13 · Unpaid premium preview

**Requirement:** BR-05. **Preconditions and test data:** Published premium recipe and unpaid buyer JWT.  
**Steps:** GET /api/recipes/{id}. Record the HTTP status and evaluate the collection assertions.  
**Expected:** 200 preview, protected fields hidden. **Actual:** 200, fullAccess false and fields hidden.  
**Status:** PASS. **Evidence:** Newman API-11. **Defect:** —.

### TC-14 · Reject free purchase

**Requirement:** BR-06. **Preconditions and test data:** Free recipe and buyer JWT.  
**Steps:** POST /api/orders/{recipeId}. Record the HTTP status and evaluate the collection assertions.  
**Expected:** 400 and no free purchase. **Actual:** 400, documented error verified.  
**Status:** PASS. **Evidence:** Newman API-20. **Defect:** —.

### TC-15 · Duplicate premium order

**Requirement:** BR-06. **Preconditions and test data:** Buyer already has same recipe PENDING.  
**Steps:** Repeat POST /api/orders/{recipeId}. Record the HTTP status and evaluate the collection assertions.  
**Expected:** 409 duplicate purchase. **Actual:** 409, conflict verified.  
**Status:** PASS. **Evidence:** Newman API-14. **Defect:** —.

### TC-16 · Invalid JWT

**Requirement:** BR-02. **Preconditions and test data:** Malformed bearer fixture.  
**Steps:** GET /api/recipes with invalid fixture. Record the HTTP status and evaluate the collection assertions.  
**Expected:** 401, JSON error for invalid or expired token. **Actual:** 401, JSON error for invalid or expired token.  
**Status:** PASS. **Evidence:** Newman API-23. **Defect:** —.

### TC-17 · Empty ingredients

**Requirement:** BR-03. **Preconditions and test data:** Chef JWT, valid recipe fields and empty ingredients.  
**Steps:** POST /api/recipes. Record the HTTP status and evaluate the collection assertions.  
**Expected:** 400 ingredients validation error. **Actual:** 400, ingredients field verified.  
**Status:** PASS. **Evidence:** Newman API-21. **Defect:** BUG-01.

### TC-18 · Empty steps

**Requirement:** BR-03. **Preconditions and test data:** Chef JWT, valid recipe fields and empty steps.  
**Steps:** POST /api/recipes. Record the HTTP status and evaluate the collection assertions.  
**Expected:** 400 steps validation error. **Actual:** 400, steps field verified.  
**Status:** PASS. **Evidence:** Newman API-22. **Defect:** BUG-01.
