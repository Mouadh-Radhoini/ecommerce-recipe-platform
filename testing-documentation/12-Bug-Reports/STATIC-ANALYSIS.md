# Static analysis and dependency findings

SpotBugs analyzed compiled backend classes on JDK 21. It recorded 17 priority-2 findings, zero analyzer errors and zero missing classes. Ten `EI_EXPOSE_REP2` findings concern mutable references retained by a constructor or setter. Six `EI_EXPOSE_REP` findings concern collection getters exposing mutable references. One `CT_CONSTRUCTOR_THROW` finding concerns a throwing JwtService constructor. These are analyzer findings pending code review. The campaign did not reproduce a business failure from them. See [SpotBugs XML](../13-Test-Results/Logs/spotbugs.xml) and [execution log](../13-Test-Results/CI/spotbugs.log).

| Tracking ID | Scoped audit | Moderate or lower | High | Critical | Disposition |
|---|---|---:|---:|---:|---|
| DEP-01 | Frontend runtime dependency graph | 0 | 6 | 0 | Open, high. Review patched Angular dependencies before deployment |
| DEP-02 | Full frontend dependency graph | 22 | 30 | 4 | Open, critical. The critical packages appear only with development dependencies included |
| DEP-03 | Validation tool dependency graph | 6 | 12 | 1 | Open, critical. The critical package is transitive to the local test toolchain |

The full Angular graph includes its runtime graph. Totals should be read per report. npm audit counts affected package entries, including transitive packages. Its severity ratings do not establish exploitability in this application's configuration. Dependency remediation is pending to keep this campaign focused on testing and the verified recipe validation defect. Audit was run separately from CI, which records build and test exit codes. See [runtime audit](../13-Test-Results/Logs/frontend-audit-runtime.json), [full frontend audit](../13-Test-Results/Logs/frontend-audit-all.json) and [validation tool audit](../13-Test-Results/Logs/test-tools-audit.json).
