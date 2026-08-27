# Implementation and Operations Map

## Where the bundle meets the application

| Bundle concept | Current implementation location | Next extension point |
|---|---|---|
| Active authority context | `user_contexts`, protected Mission Control procedures, dashboard context card. | Context-administration UI and richer relationship-based authorization after requirements review. |
| Requirements Q&A | `requirements_register` and Mission Control Requirements view. | Ingest AGENT-002 through AGENT-012 after founder answers. |
| Mission and work graph | `missions`, `work_items`, Mission Control Missions view. | Store mission packets, agent-run identifiers, dependency graph, and staffing/role selection. |
| Context packs | `context_packs`, `context_pack_sources`, allowlist helpers. | Add source-change detection and retrieval evaluation cases. |
| Artifacts/reviews | `artifacts`, `artifact_citations`, `reviews`. | Add explicit artifact contracts, review assignments, and reviewer conflict checks. |
| Decision gates | `decision_gates`, `decisions`, Governance view. | Implement the proposed G0–G4 taxonomy only after founder review. |
| Alerts/evaluation | `evaluations`, `notifications`, `audit_events`, safety scan. | Add approved schedules, alert acknowledgement, and recovery/run history after G3. |

## Staged activation plan

| Stage | Goal | Safe work now | Requires a founder decision |
|---|---|---|---|
| **A. Knowledge readiness** | Resolve first-mission and agent-role questions. | Create/answer Q&A records; assemble approved source packs; prepare team cards. | Selection of initial profiles, tools, data policy, and cost limits. |
| **B. Supervised team rehearsal** | Run one role sequence manually. | Knowledge → requirements → design → engineering → independent review on synthetic scope. | Any change to access, source allowlist, or external tool use. |
| **C. Orchestrated work graph** | Create draft work packets from an approved mission. | Add mission-packet records, routing recommendation, and audit trail. | Automated assignment acceptance or broader agent tool access. |
| **D. Controlled recurring operations** | Add deterministic scans/reminders. | Design idempotency, recovery, alert, and monitoring plan. | Scheduler/persistent runtime provisioning and cost commitment. |
| **E. Scoped Company Agent pilot** | Support one named Company Admin. | Prepare a delegated-workflow specification and isolated synthetic test. | Data access, entity agreement/SLA, external action, and non-synthetic use. |

## Cloud computer decision

No cloud computer has been connected. This is intentional—not because a persistent runtime is unwanted, but because one should be provisioned only when an approved workload has a clear purpose that cannot be served by the managed app runtime. A request for one must state the job type, frequency, concurrency, data classification, secrets/connectors, network needs, operator, monitoring, retry/idempotency plan, recovery target, cost owner, and disable switch.

## Automation-engine decision

The first automation should be deterministic and recovery-oriented, such as a synthetic safety scan, missing-evidence reminder, documentation check, or test report. It should not be a broad agent loop. The activation record must include input event, idempotency key, timing, allowable side effects, error handling, alert owner, audit events, test cases, and a human kill switch.

## Source status

**Implemented / verified** for the current project map. **New proposal / open requirement** for staged activation and future extension points. The cloud and automation decision criteria apply the source preference for small coherent, idempotent, reviewable work [S1] [S7].

