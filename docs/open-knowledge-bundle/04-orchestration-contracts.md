# Orchestration Contracts

## Core principle

The source work lifecycle is: **objective → retrieved context → stated assumptions → proposed acceptance tests → implementation → automated checks → independent review → human gate where required → deployment → observed result → knowledge update**. [S3]

> **New proposal.** Treat this lifecycle as a typed, auditable work graph inside Mission Control. The orchestrator coordinates records and recommendations; it does not become an unbounded executive agent.

## Mission packet contract

Every agent assignment must start with a Mission Packet containing the following required fields.

| Field | Required content |
|---|---|
| Mission ID and title | Stable identifier and human-readable objective. |
| Active authority context | Organization, legal entity, stakeholder group, human role, and designated decision owner. |
| Pilot/data scope | Explicit `synthetic_only`, permitted data class, and prohibited actions. |
| Outcome and non-outcome | What success means and what the assignment must not attempt. |
| Approved source pack | Paths, source statuses, retrieval anchor, excerpts, and known omissions. |
| Assumptions | Explicit assumptions that need confirmation or evaluation. |
| Work graph | Dependencies, accountable human, assigned cell/profile, and handoff order. |
| Artifact contract | Required format, citations, acceptance criteria, review type, and storage location. |
| Risk and escalation triggers | Conditions that require halt, review, or founder decision. |
| Validation plan | Tests, review checks, observed outcome, and evidence required. |

## Work-packet contract

| Stage | Producer | Required output | Reviewer / gate |
|---|---|---|---|
| **Intake** | Founder / authorized operator | Mission packet, context, scope, and decision owner. | Founder confirms scope where material. |
| **Retrieve** | Knowledge Steward | Source pack with status, citations, omissions, and conflicts. | Product/Requirements review. |
| **Specify** | Product/Requirements Agent | Requirement, acceptance criteria, state model, and open questions. | Architecture + founder when authority changes. |
| **Design** | Architecture/Data Agent | Delta/ADR, data/API/security/recovery impact, and test plan. | Quality/Security review. |
| **Implement** | Application Engineering Agent | Isolated-branch code, tests, build/check output, release note draft. | Independent Quality/Security review. |
| **Evaluate** | Quality/Security Agent | Pass, revision-needed, or blocked verdict with evidence. | Named human decision where needed. |
| **Decide** | Founder / designated human | Approve, reject, defer, or revision request with rationale. | Audit record. |
| **Learn** | Knowledge Steward + operator | Requirements/decision/audit/knowledge update and next action. | Review at milestone. |

## Routing rules

1. The orchestrator may route only from a founder-approved mission and approved context pack.
2. The orchestrator may propose a task, but a human retains responsibility for accepted work ownership.
3. No agent can access a tool or dataset merely because another agent cited it. Every capability is explicitly granted per profile and mission.
4. Work that touches law, money, regulated activity, personal/private data, production permissions, external communications, or ownership must enter a human decision queue immediately.
5. Missing evidence, unmet acceptance criteria, source conflicts, or evaluation failure block promotion and create a reviewable exception record.
6. An agent run may retry a transient technical operation only according to an idempotent/recovery contract; it may not repeat external or consequential actions.

## Evidence and audit event contract

For a significant transition, record: actor; agent profile/run ID where relevant; organization/entity/group/role context; object ID/version; prior and new state; approved sources; assumption IDs; evidence references; decision/review ID; timestamp; and correlation ID. This extends the source event-first principle into the proposed agent work graph. [S3]

## Human gate taxonomy

| Gate | Human must decide | Agent may prepare |
|---|---|---|
| **G0 — Scope boundary** | Whether work remains synthetic-only and within the approved mission. | Scope summary, risks, and proposed constraints. |
| **G1 — Source and requirement acceptance** | Whether source pack/use and new requirements are sufficient to proceed. | Citation/evidence ledger and open questions. |
| **G2 — Design/implementation promotion** | Whether a reviewed technical change can move beyond a branch or pilot state. | Diff, tests, review, recovery plan, and release notes. |
| **G3 — Automation activation** | Whether a deterministic recurring job may operate under named rules. | Schedule, idempotency/retry plan, owner, alerts, cost, and stop conditions. |
| **G4 — External/consequential boundary** | Whether a legally/operationally appropriate human-led process may proceed. | Decision packet only; no autonomous action. |

## Source status

The lifecycle, attribution, and human-authority principles are **source-grounded** in [S1], [S2], [S3], and [S7]. The packet fields, routing rules, and gate taxonomy are **new proposals** for Mission Control implementation.

