# Mission and Artifact Contracts

## Mission packet

Every activity starts with a mission packet. A task without an actor, authority context, evidence boundary, reviewer, and definition of done is not ready for agent execution.

| Field | Required content |
|---|---|
| Mission identity | ID, title, owner, time boundary, priority, and one-sentence intended outcome. |
| Authority context | Actor, stakeholder group, legal entity, human role, permission basis, agreement/SLA, and decision owner. |
| Safety mode | Synthetic-only/live status; data class; prohibited actions; required professional/consent gates. |
| Approved context | Source paths, commits/hashes, source status, retrieval reason, and known conflicts. |
| Team plan | Activated profile(s), one accountable work owner, independent reviewer, and no shared write target. |
| Artifact contract | Expected files/records, required source citations, acceptance criteria, format, and audience. |
| Gate and escalation | Human decision required, stop conditions, escalation route, and rollback/recovery expectation. |
| Learning record | Metrics, observed result, affected requirements/QA/decision/open-question records, and next hypothesis. |

## Work packet and handoff contract

Each subtask gets a work packet, not a free-form request. It contains the mission ID, assigned profile, exact question, allowed sources/tools, required output, no-go actions, deadline/SLA, reviewer, and return location. The receiver must state assumptions and source gaps before proceeding.

| Handoff | Required producer record | Required recipient response |
|---|---|---|
| Research → Product | Evidence map, claims, confidence, source citations, unresolved questions. | Requirement interpretation, impact, and acceptance-test additions. |
| Product → Architecture/Data | PRD, scenarios, object/state needs, priority, constraints. | Design alternatives, contracts, risk, and decision request. |
| Architecture → Engineering | Approved decision, interfaces, schema/migration, constraints, rollback plan. | Implementation plan, test plan, and branch/worktree. |
| Engineering → Assurance | Diff/artifacts, tests run, limitations, environment, evidence. | Independent test/evaluation and pass/fail recommendation. |
| Assurance → Human gate | Findings, risk severity, remediation, evidence, proposed decision. | Approve, reject, defer, request revision, or route to qualified review. |
| Human gate → Knowledge | Decision, rationale, effect, evidence, owner, and date. | Update registers, traceability, and next mission candidate. |

## Artifact status labels

| Status | Meaning |
|---|---|
| Draft | Prepared by an assigned profile; not accepted. |
| Independently reviewed | Reviewed by a profile/team separate from the author. |
| Human approved | Approved by the named human decision owner for the stated scope. |
| Rejected / deferred | Not promoted; retains a recorded reason and next condition. |
| Superseded | Retained for lineage; replaced by a named later artifact or decision. |

Artifacts that make claims must contain source links/paths, source status, author profile, reviewer, decision status, and known limitations. Do not overwrite historical artifacts or audit events; publish a correction or superseding record. [1]

## Reference

[1]: https://github.com/donaldhaight/human-blockchain-operating-system/blob/be1725e/AGENTS.md "Source, audit, and branch rules"
