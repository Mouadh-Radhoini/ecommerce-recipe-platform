# Non-functional test report

Two local listing tests used 10 virtual users for 10 seconds, with a 100 ms pause per iteration. Setup registered one buyer per run. The API returned a JSON array on all listing iterations. Thresholds were p95 below 500 ms and a listing HTTP error rate below 1%.

| Run | Listings | All HTTP requests | Listings/s | Mean | p95 | Listing error rate | Status |
|---|---:|---:|---:|---:|---:|---:|---|
| 1 | 930 | 931 | 91.71 | 7.08 ms | 12.86 ms | 0.00% | PASS |
| 2 | 940 | 941 | 92.68 | 5.98 ms | 8.64 ms | 0.00% | PASS |

| Check | Observed result |
|---|---|
| SEC-01, API-05 | Missing JWT returns 401 |
| SEC-02, API-07 | Buyer publication returns 403 |
| SEC-03, API-11 | Unpaid preview hides premium instructions and ingredients |
| SEC-04, API-23 | Malformed bearer returns 401 and documented error JSON |

The listing throughput and latency exclude registration. All HTTP requests include that single setup request. These measurements describe the local machine, fixture size and short duration. Follow up with production-sized data, longer runs and representative authorization roles in an isolated staging environment before defining service targets.

[k6 summaries](../13-Test-Results/Performance/) · [Newman security evidence](../13-Test-Results/API/newman.json)
