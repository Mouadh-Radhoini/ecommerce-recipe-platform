# Requirements traceability matrix

PASS describes the stated acceptance criterion under the executed fixtures. PARTIAL records a meaningful passed subset with remaining release evidence.

| ID | Description and acceptance criterion | Priority / risk | Cases | Verification |
|---|---|---|---|---|
| BR-01 | Register both roles. Valid data returns 200 and correct identity. Duplicate email returns 409 | High / R-07 | API-01/02/12; TC-02/07 | PASS |
| BR-02 | Protect recipe listing. Missing or malformed bearer returns 401. Valid buyer JWT returns 200 array | High / R-01 | API-05/06/23; TC-01/04 | PASS |
| BR-03 | Permit chef publication only. Buyer returns 403. Valid chef returns saved recipe. Invalid payload returns 400 | High / R-02/07 | API-07–09/21/22; TC-10–12 | PASS |
| BR-04 | Free price is zero. Positive premium price persists. Zero premium price is rejected | High / R-07 | UT-01/02/11; API-08/19 | PASS |
| BR-05 | Unpaid preview withholds ingredients and steps. Persisted PAID order unlocks full contents | High / R-03 | API-11; IT-07; UT-07/08; TC-13 | PASS |
| BR-06 | Reject free and duplicate orders. Eligible orders start PENDING. Verify provider-confirmed payment state | High / R-04/05 | API-13/14/20; IT-07; TC-14/15; ST-01–07 | PARTIAL. ST-02–05 BLOCKED |
| BR-07 | CRUD round-trips data. Duplicate ID and configured per-collection buyer email index reject collisions | High / R-06 | IT-01–08 | PASS in the tested configuration |
| BR-08 | Chef signs in, publishes, retrieves the record and logs out. Guard denies logged-out creation route | High / R-08 | UI-01 twice | PASS |
| BR-09 | Seven-character registration password returns 400. Eight-character password succeeds | Medium / R-07 | API-17/18; TC-08/09 | PASS |
| BR-10 | Correct credentials return identity and usable JWT. Wrong password returns 401 | High / R-01 | API-03/04/06; UT-10/12; TC-03–05 | PASS |

See TRACEABILITY-AND-REGRESSION.md for status by test ID and TESTING-SUMMARY.md for the executed campaign denominator.
