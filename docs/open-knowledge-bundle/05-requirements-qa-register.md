# Requirements Q&A Register

## Answered questions

| ID | Question | Current answer | Status | Resulting delta |
|---|---|---|---|---|
| INFRA-001 | Did we create a connection to a cloud computer? | No. The application uses a managed web runtime and no persistent cloud computer, worker, or background service is provisioned. The workload, data classification, recovery owner, schedule, and cost justification are not yet approved. | Confirmed | Defer persistent compute. Keep the pilot modular and synthetic-only. |
| GOV-001 | Can agents make binding or consequential decisions? | No. The founder is final human authority. Agents may prepare, analyze, draft, test, recommend, monitor, and explain. Binding, regulated, financial, external, production-access, and material operating-model changes require human authority. | Confirmed | Human gate and rationale are required for relevant promotion. |
| AGENT-001 | Are agent teams already fully set up? | No. High-level roles, Company Agent limits, and a work lifecycle are present in Human Blockchain source. Q212 explicitly keeps the first-agent question open. Current Mission Control uses team labels and a synthetic workflow, not deployed autonomous teams. | Confirmed | Use supervised starter cells; do not claim production team deployment. |
| RETRIEVAL-001 | Should the entire Human Blockchain repository be injected into every task? | No. Use approved, focused context packs with source status, citations, omissions, and explicit proposal separation. | Confirmed | Maintain source pack rather than generic whole-corpus prompts. |

## Open questions to resolve before team setup

| ID | Question for founder/decision owner | Why it matters | Recommended answer format | Decision gate |
|---|---|---|---|---|
| AGENT-002 | What is the single first mission the starter cells must complete in the next 7–14 days? | Defines scope, context, tests, tools, and learning value. | One sentence outcome, user, evidence of done, and explicit non-outcomes. | G0 |
| AGENT-003 | Which of the proposed roles should exist as separate supervised runs at L1? | Prevents both role collapse and premature agent multiplication. | Select 3–5 profiles from the proposed cards; name human owner. | G1 |
| AGENT-004 | What data may each role read, write, upload, or cite? | Determines context isolation, storage, and privacy controls. | Per-role: allowed sources, prohibited sources, retention, and reviewer. | G1 |
| AGENT-005 | Which tools may each role use? | Browser, repository, database, storage, LLM, notification, and external tools have different authority/cost exposure. | Per-role allowed tools and explicit disallowed tools. | G1 |
| AGENT-006 | What may the orchestrator do automatically versus only recommend? | Establishes the core autonomy boundary. | Split into “auto-create draft record,” “ask human,” and “never.” | G2 |
| AGENT-007 | What constitutes independent review for each artifact type? | Avoids the same agent rubber-stamping its own output. | Reviewer profile, pass criteria, blocking findings, and escalation owner. | G2 |
| AGENT-008 | What model/provider policy and cost ceiling applies per mission? | Prevents uncontrolled cost and mismatch between task risk and model capability. | Allowed models, spending cap, logging, fallback, and stop threshold. | G1 |
| AGENT-009 | Do any recurring scans, reminders, or imports need to run without a user present? | Determines if scheduling/persistent infrastructure is necessary. | Exact trigger, frequency, idempotency key, owner, alert, recovery, cost, and stop condition. | G3 |
| AGENT-010 | When will Company Admin Agents move beyond read/draft/recommend mode? | This changes entity-specific authority, data, and operational risk. | Named entity, workflow, lawful delegation, data scope, human acceptance action, and reversible pilot. | G4 |
| AGENT-011 | What defines success/failure for the One Prompt Event rehearsal? | Makes the clean-clone test measurable rather than theatrical. | Required inputs, artifacts, tests, time/cost cap, human review, and recovery expectations. | G2 |
| AGENT-012 | What is the planned path from synthetic data to authorized test data? | Prevents accidental use of live or regulated information. | Data class, consent/authority, minimization, isolation, retention, reviewer, and release gate. | G4 |

## Questions the agent team must ask before each new mission

1. What is the founder-approved outcome, and what is explicitly out of scope?
2. Under which organization, legal entity, stakeholder group, and role is the work being performed?
3. Which source paths are controlling, and what information is missing or conflicting?
4. What may this role read, write, call, or recommend—and what may it never do?
5. What evidence proves the work is correct, safe, and complete?
6. Who independently reviews it, who resolves the gate, and what happens if the review fails?
7. What data, cost, security, recovery, and external-effect risks are introduced?
8. Which decision, open question, glossary, QA, and legal records must be updated? [S5]

## Source status

INFRA-001 and GOV-001 reflect the current pilot and source authority boundaries. AGENT-001 is source-grounded in [S2], [S3], [S4], and [S7]. AGENT-002 through AGENT-012 are **open requirements** created to make an actual team setup decision-ready.

