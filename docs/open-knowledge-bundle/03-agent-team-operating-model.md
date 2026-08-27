# Agent-Team Operating Model

## Answer to the team-setup question

The Human Blockchain repository **does spell out important agent-team principles**. It names a high-level cross-functional team, describes a bounded Company Agent associated with each Company Admin, supplies a work-item lifecycle, and defines hard human stop conditions. It **does not**, however, provide a final operating specification for actual deployed teams. Its own Q212 asks which AI agents are needed first and remains open. [S2] [S3] [S4] [S7]

The current Mission Control application faithfully models the early part of this structure—context, tasks, source packs, evidence, review, gates, alerts, and audit—but it does not yet deploy an autonomous agent team. [S3] [S4]

## Source-grounded role inventory

| Role from source | Source responsibility | Hard boundary |
|---|---|---|
| Chief Orchestrator | Break approved objectives into work, coordinate dependencies, maintain status. | Cannot change authority or approve release. |
| Product/Requirements | Convert narration/evidence into criteria and state models. | Cannot invent binding policy. |
| Domain Research | Retrieve corpus and external primary sources; identify alternatives/risks. | Cannot decide legal/business conclusions. |
| Architecture | Maintain boundaries, schema, events, and technical decisions. | Cannot override product/founder authority. |
| Application Engineering | Implement UI and API capabilities. | Cannot deploy consequential change without gates. |
| Data/Knowledge Engineering | Ingestion, registry, retrieval, lineage, evaluation. | Cannot promote inference as founder decision. |
| Quality/Security | Test permissions, workflow, privacy, failures, recovery. | Cannot waive failed controls. |
| Business Operations | Configure companies, onboarding, tasks, SLAs, and case studies. | Cannot bind entities without human authority. |
| Finance/Compliance Support | Prepare packages and scenarios. | Cannot practice a profession or move money. |
| Culture/Growth | Prepare domains, content, onboarding, and campaign material. | Cannot make unsupported performance/investment claims. |
| Company Admin / Company Agent | Human owner plus bounded supporting service identity for entity workflows. | Agent remains read/draft/recommend until a specific lawful delegation exists. |

## New proposal: start with a three-cell team, not a large agent swarm

> **New proposal.** Begin with three bounded cells that collaborate through Mission Control records. Each “cell” is a workstream and may initially be one human plus one or more tightly scoped agent runs. Do not deploy all named source roles as persistent autonomous agents on day one.

| Cell | Initial roles | First approved work | Why it comes first |
|---|---|---|---|
| **1. Knowledge & Requirements Cell** | Knowledge Steward, Product/Requirements Agent, Documentation Agent | Convert selected Human Blockchain source packs and founder answers into a prioritized requirements register, glossary, and acceptance criteria. | Keeps the system source-grounded and turns ambiguity into visible decisions. |
| **2. Mission Engineering Cell** | Mission Orchestrator, Architecture/Data Agent, Application Engineering Agent | Deliver one bounded synthetic lead-to-task loop with typed state, evidence, tests, and a release record. | Proves the control plane rather than multiplying plans. |
| **3. Assurance & Operations Cell** | Quality/Security Agent, Independent Review Agent, Company Admin Support Agent | Test controls, run safety scans, prepare exception packets, and verify that no unapproved state is promoted. | Makes governance and learning real from the first loop. |

### Deferred specialist cells

Finance/Compliance Support, Culture/Growth, and Sponsor Package roles should remain **on-demand advisory workstreams** until an approved mission requires them. They handle sensitive or externally consequential domains and require more precise authority, data, review, and communications rules. This is a staging recommendation, not a judgment that they are unimportant.

## Proposed agent profile cards

| Profile | Mission | Context it may read | Permitted output | Forbidden action | Primary acceptance test |
|---|---|---|---|---|---|
| **Mission Orchestrator** | Compile a founder-approved mission into work packets and dependencies. | Approved mission, active context, requirement IDs, approved source pack, open risks. | Work graph, routing recommendation, status brief, escalation packet. | Selecting a new strategy, bypassing a gate, or self-approving work. | Every work item has owner, artifact contract, criteria, source pack, and reviewer. |
| **Knowledge Steward** | Build focused source packs and preserve provenance. | Approved Human Blockchain paths and submitted synthetic evidence only. | Source ledger, cited excerpt, conflict note, retrieval evaluation. | Treating derived inference as a source statement or fetching unapproved paths. | Each claim points to an approved source/status or is labeled proposal/assumption. |
| **Product/Requirements Agent** | Turn narration and evidence into testable requirements. | Founder instruction, source pack, open-question register, decision log. | Requirements, state transitions, acceptance tests, architecture deltas. | Declaring unresolved policy as settled. | Each requirement has status, priority, evidence, owner, and decision needed. |
| **Architecture/Data Agent** | Design the smallest coherent technical change. | Approved requirement, code/schema/docs, source pack. | ADR/delta, schema/API proposal, migration/test plan. | Merging/deploying or changing access rules without a gate. | Proposal includes authority/data/recovery impact and rollback approach. |
| **Application Engineering Agent** | Implement a bounded approved change in an isolated branch/worktree. | Approved work packet and relevant source/code context. | Code, test, build result, release note draft. | Writing to another agent’s branch, publishing, or exposing credentials. | Tests/type/build pass and independent review is attached. |
| **Quality/Security Agent** | Independently challenge failures, permissions, source use, and recovery behavior. | Requirements, tests, diff, audit records, source pack. | Review verdict, risk findings, evaluation record, improvement candidate. | Waiving a failed control or resolving its own finding. | Review is independent and covers stated acceptance/security criteria. |
| **Company Admin Support Agent** | Support a named Company Admin in read/draft/recommend mode. | Only the specific entity/group/role context and approved records. | Task briefs, SLA exception summaries, draft notices, evidence-missing alerts. | Binding company, moving money, assigning authority, external contacting, or production permission change. | Every recommendation names basis, owner, and human next action. |

## Proposed ownership and independence rules

1. A single agent run may not both implement a material change and issue its independent review.
2. Each agent run receives the smallest approved context pack needed for its work; it does not receive unrestricted corpus, database, or credential access.
3. Only a named human may resolve a consequential decision gate; a “decision owner” is a role, not a generic agent title.
4. Agents work in isolated branches or worktrees. No two agents write the same checkout concurrently. [S1]
5. Every agent output is either source-grounded, an assumption, a proposal, a test result, or a finding. It must say which.
6. A Company Agent is scoped to the Company Admin’s entity/group context and does not automatically gain platform-wide authority. [S2] [S6]

## Team maturity ladder

| Level | Description | Do not advance until |
|---|---|---|
| **L0 — Documents only** | Roles and contracts are documented; no team execution. | Founder reviews this bundle and resolves core Q&A. |
| **L1 — Supervised runs** | Human starts individual role runs; all outputs are reviewed manually. | One synthetic Mission Control loop is repeatable. |
| **L2 — Bounded routing** | Orchestrator can create draft work packets from approved missions; humans accept assignments. | Routing accuracy, cost, data boundaries, and review quality meet agreed targets. |
| **L3 — Controlled automation** | Deterministic safety scans and reminders run on an approved schedule. | Idempotency, recovery, alert ownership, and persistent-runtime decision are approved. |
| **L4 — Scoped Company Agents** | Entity-specific agents assist Company Admins with permitted data and workflows. | Entity isolation, agreement/SLA rules, data classification, and escalation pathways are tested. |

## Source status

The role inventory and limits are **authoritative source/working source** from [S2], [S3], [S4], [S6], and [S7]. The three-cell starter design, profile cards, ownership rules, and maturity ladder are **new proposals** awaiting requirements review and founder approval.

