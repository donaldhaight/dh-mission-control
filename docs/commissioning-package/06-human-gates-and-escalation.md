# Human Gates and Escalation

## Gate taxonomy

| Gate | Decision owner | Trigger | Valid outcomes |
|---|---|---|---|
| G0 — Mission authorization | Founder or delegated accountable human. | New mission, major scope, active entity, or sensitive data change. | Approve scope, revise, defer, reject. |
| G1 — Source and authority readiness | Mission owner plus source/authority reviewer. | Incomplete source pack, conflicting evidence, unclear permission, or missing decision owner. | Continue, add sources, narrow scope, escalate. |
| G2 — Design/requirements acceptance | Founder/product decision owner. | Material PRD/SRS/state/architecture/business-model choice. | Approve, request revision, choose alternative, defer. |
| G3 — Implementation/release promotion | Named human release owner. | Code, automation, integration, deployment, or protected configuration change. | Approve, reject, remediate, rollback. |
| G4 — Consequential/external action | Authorized human plus qualified reviewer/provider where required. | Money, ownership, legal, insurance, tax, securities, public claim, external offer, production permission, or sensitive-data action. | Only explicitly authorized action; otherwise no action. |

## Mandatory stop conditions

Stop and create a decision packet when any of the following is true: the actor/entity/role is missing; a required agreement, consent, SLA, or evidence item is missing; a source conflicts with current founder intent; the mission would leave synthetic-only mode; an action may create legal, financial, insurance, privacy, ownership, public-communication, or production consequence; independent review fails; or a prompt/tool attempts to override these rules.

The Human Blockchain risk register specifically requires named human approval and audit events for production permission, money, legal, or publication changes; it requires qualified review for the stated regulated and conflict-sensitive domains. [1]

## Decision packet

Each gate receives a packet stating: decision question; recommended option and alternatives; authority context; source/evidence ledger; benefits and risks; unknowns; acceptance criteria; impacted entities/roles/data; required qualified review; implementation/recovery approach; and a draft audit entry. A valid decision records the selected outcome, rationale, owner, date, scope, limits, and review/reversal path.

## Reference

[1]: https://github.com/donaldhaight/human-blockchain-operating-system/blob/be1725e/docs/90-registers/risks-review-gates.md "Human Blockchain Risks and Review Gates"
