# Bug register

| ID | Defect | Severity | Priority | Final status |
|---|---|---|---|---|
| BUG-01 | Recipe API accepts empty ingredients or preparation steps | Medium | High | Fixed, retested and closed |

**Reproduce:** Register a disposable chef. Send two valid recipe requests with empty ingredients and empty steps respectively using API-21 and API-22.  
**Expected:** HTTP 400, field error. **Before:** HTTP 200 for each request.  
**Cause:** @NotNull permitted empty arrays. **Fix:** Both DTO list fields now use @NotEmpty.  
**Retest:** Both return 400 with a field error. The full regression passed.  
**Evidence:** [Before fix](../13-Test-Results/API/bug-01-before.json) · [Final Newman result](../13-Test-Results/API/newman.json) · [Detailed defect](BUG-01.md).

The open application defect count is zero. The dependency register tracks two critical toolchain groups and one high frontend-runtime group. SpotBugs detected 17 priority-2 findings for review. The Java 25 analyzer incompatibility was a resolved environment issue. A prior Lombok issue is omitted because comparable before-and-after evidence was unavailable.

[Static analysis](STATIC-ANALYSIS.md) · [Regression result](../13-Test-Results/Regression/README.md)
