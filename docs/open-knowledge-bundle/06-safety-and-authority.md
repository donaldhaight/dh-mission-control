# Safety, Authority, and Stop Conditions

## Governing rule

Agents assist; named humans remain accountable. The Human Blockchain source provides a broad standard: agents may work within bounded authority, but must not independently create legal obligations, accept or move money, transfer ownership, contact outside parties, make binding offers, or change protected permissions without narrowly defined lawful and tested delegation. [S1] [S2] [S7]

## Current pilot hard boundary

| Area | Current rule |
|---|---|
| Data | Synthetic-only. No live customer, regulated, private, financial, or production data. |
| Sources | Only approved Human Blockchain repository paths may enter a Mission Control context pack. |
| Outputs | Drafts, analyses, review findings, requirements, and decision packets are allowed; they remain internal and human-gated. |
| Files | Managed object storage holds bytes; the relational database holds references and provenance only. |
| Actions | No live financial, legal, regulated, external-communication, production-access, or public action adapters are available. |
| Decisions | A designated human decision owner must record a rationale for gate resolution. |
| Automation | Safety scans are controlled, trigger-based pilot routines; no unapproved persistent schedule exists. |

## Stop conditions

The proposed orchestrator must halt and create a human decision packet when any of the following appears:

1. A request would change a legal entity, ownership, contractual obligation, money movement, regulated operation, access privilege, production system, public claim, or external communication.
2. A source path is not in the approved pack, conflicts with a higher authority, or cannot be classified.
3. A task needs non-synthetic, confidential, restricted, personal, or regulated data.
4. An implementation needs a secret, connector, persistent cloud computer, scheduler, elevated browser session, or third-party API beyond the mission’s approved capability list.
5. An artifact lacks evidence, independent review, a named human owner, acceptance criteria, or recovery plan appropriate to its risk.
6. A model output claims certainty, authority, approval, performance, valuation, or an external fact that is not source-cited and verified.
7. A retry could duplicate a consequential result, a notification is failing, or system behavior is no longer idempotent/recoverable.

## Capability classification

| Capability level | Examples | Who may initiate | Required record |
|---|---|---|---|
| **Observe** | Read approved source, inspect synthetic status, calculate readiness. | Authorized agent or human. | Retrieval/audit event. |
| **Prepare** | Draft requirement, context pack, code change, review packet, alert draft. | Authorized agent/human in approved scope. | Artifact contract and source/assumption labels. |
| **Recommend** | Propose route, task, escalation, improvement, or decision option. | Authorized agent/human. | Recommendation, evidence, uncertainty, and owner. |
| **Execute reversible synthetic action** | Create synthetic task, synthetic evidence reference, non-live test, branch artifact. | Protected server procedure or human with approved scope. | Audit event and validation result. |
| **Approve / promote** | Resolve a gate, accept a release/automation scope, grant a defined configuration change. | Named human decision owner. | Decision rationale, review evidence, and audit event. |
| **Consequential external action** | Sign, pay, publish, contact, grant production access, submit, bind, or transact. | Never by agent in current pilot. | Future lawful workflow with explicit authorization. |

## Source status

**Authoritative source / implemented verified.** The agent authority boundary is grounded in [S1], [S2], and [S7]. The capability classification operationalizes those principles as a **working model** for Mission Control.

