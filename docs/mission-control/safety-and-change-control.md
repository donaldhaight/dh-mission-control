# Safety and Change Control

## Non-negotiable pilot boundary

DH Mission Control is a **synthetic-only** application. This is enforced in the data model and server contracts, not merely signaled in the interface. The pilot may organize, analyze, draft, test, review, and recommend within its approved context. It must not execute or imply authority for live financial, legal, insurance, regulated, external-communication, production-access, security-sensitive, or other consequential actions.

## Authority model

| Question | Required rule |
|---|---|
| Who can see protected records? | An authenticated internal user with an authorized synthetic active context. |
| Which context applies? | The selected organization, legal entity, stakeholder group, and human role owned by the current user. |
| Who can resolve a gate? | A designated decision owner or administrator, with a non-empty rationale. |
| What can an agent do? | Prepare structured drafts and review-ready material from approved context. |
| What can an agent not do? | Promote consequential state, choose a binding decision owner, or perform an external action. |
| What happens on uncertain access or data? | The action is denied, held for review, or treated as an architecture/requirements question. |

## Source-grounding rules

Only explicitly approved Human Blockchain repository paths can form a context pack. Every source retains a status label. A source citation is not a claim that the source is current, complete, or suitable for a consequential decision; it is an auditable record of the material considered. If a source conflicts with another source or appears stale, record the conflict and route it to the requirements register or a decision gate.

## Evidence-handling rules

Use managed storage for file bytes and the relational database for the reference, provenance, sensitivity, source type, and audit linkage. All pilot files must be synthetic. Upload rejection is a safe result when a file is restricted, live, misclassified, overly large, or otherwise outside the permitted pilot scope.

## Human decision-gate rules

A gate must identify its decision question, owner, linked mission/work, synthetic scope, status, due date where applicable, and rationale when resolved. The designated human decision owner selects one of the available outcomes: approval, rejection, deferment, or revision request. A decision record and audit event must be created. If the decision is ambiguous, defer or request revision rather than approving a broader interpretation.

## Controlled improvement loop

An evaluation can identify an **improvement candidate** for a skill, workflow, source catalog, agent prompt, automation, or system component. An improvement candidate is not an automatic change. It must move through this sequence:

1. Record the trigger, evidence, affected scope, and candidate change.
2. Assess possible authorization, data, security, quality, cost, and reversibility effects.
3. Add or update the requirements register and architecture delta.
4. Write a focused test or evaluation case.
5. Obtain the appropriate human decision before changing a consequential or protected behavior.
6. Implement in a version-controlled branch, validate, and preserve a rollback point.

## Change categories

| Change | May be handled in normal pilot work? | Required escalation |
|---|---|---|
| Copy, layout, and synthetic dashboard display | Usually, after normal review and tests. | Record if it changes meaning or safety communication. |
| New approved repository path | No. | Source review, allowlist update, evaluation, Q&A/architecture delta, and approval. |
| New agent output type | No. | Artifact contract, review rule, evaluation criteria, and decision gate. |
| New automation or scheduled action | No. | Workload design, idempotency, owner, retry/recovery plan, authority model, and approval. |
| Persistent cloud computer | No. | Concrete workload, data classification, operator/recovery owner, monitoring, budget, and approval. |
| External integration or communication | No. | Connector/API review, explicit human confirmation, data and permission review, and decision gate. |
| Relaxing synthetic-only controls | Never through a routine change. | New release scope, risk review, test plan, named owner, and formal authorization. |

## Audit and review expectations

The system records retrieval, context activation, draft/review events, decisions, safety scans, and other significant actions with a correlation ID. Operators should use this ledger to explain *what happened*, *under which context*, *why it was permitted*, and *what still requires human attention*. Audit records are operational evidence; they do not replace independent validation of the underlying source or decision.

