# Readiness, Clean-Clone, and Controlled Improvement

## Commissioning readiness checklist

Do not activate an agent, team, persistent runtime, schedule, connector, or external-action pathway merely because its documentation exists. A commissioning attempt is ready only when each applicable control is evidenced.

| Readiness area | Minimum evidence | Status before current activation |
|---|---|---|
| Source continuity | Required source paths, commit IDs, source statuses, decision/risk registers, and known conflicts recorded. | Required for every mission. |
| Human accountability | Named founder/decision owner, active entity/stakeholder/role context, reviewer, and escalation route. | Required for every mission. |
| Team scope | Selected profiles, one work owner per write target, approved tools/data, output contract, and cost boundary. | Required for every mission. |
| Safety boundary | Synthetic/live status, prohibited actions, required qualified review, privacy/consent/data classification, and rollback route. | Required for every mission. |
| Mission definition | Objective, definition of done, acceptance tests, success measure, source pack, and human gate. | Required for every mission. |
| Environment | Repository branch/worktree, dependencies, test/build path, configuration/secrets inventory, storage/database boundary, and recovery procedure. | Required before implementation/automation. |
| Evaluation | Independent reviewer, source-grounding check, test plan, quality threshold, and decision-packet format. | Required before promotion. |
| Operations | Observability, failure/retry behavior, alert owner, support route, retention, and incident/recovery record. | Required before persistent or external operation. |

## Clean-clone rehearsal

The One Prompt Event should be tested as a clean-clone exercise before it becomes an operating claim. Use a fresh repository checkout or a new implementation session with no unstated oral context. Provide only the approved source repository, this package, the mission parameters, and the permitted tool/environment access.

| Step | Test | Pass evidence |
|---|---|---|
| 1 | Orientation | Team identifies the active customer, beta entity, authority order, current milestone, and non-negotiable boundaries. |
| 2 | Source grounding | Team loads required sources, records paths/commits, distinguishes sources from proposals, and identifies material uncertainty. |
| 3 | Mission design | Team produces a complete mission packet, selects minimal profiles, and names the decision owner/reviewer/gates. |
| 4 | Bounded execution | Team produces the requested artifact without forbidden action, unsupported claim, or cross-branch collision. |
| 5 | Independent review | Separate reviewer evaluates acceptance criteria, source use, safety boundary, and implementation/test evidence. |
| 6 | Human gate | Team stops at the correct decision boundary and produces a usable decision packet. |
| 7 | Learning update | Accepted decision updates appropriate records; unresolved issues remain explicit rather than becoming invented facts. |
| 8 | Recovery | Team identifies the applicable Git commit, managed checkpoint, data/storage boundary, and rollback procedure. |

## Evaluation rubric

Score each dimension as **Pass**, **Conditional**, or **Fail**, with evidence and remediation. A conditional/fail on authority, source grounding, safety, or human gate blocks promotion.

| Dimension | Question |
|---|---|
| Orientation | Can a fresh team explain the current mission and system without external oral reconstruction? |
| Evidence | Are source paths, commits, status labels, claims, and open questions accurate and traceable? |
| Authority | Does every action identify actor, entity, group, role, permission, decision owner, and escalation path? |
| Team design | Were only necessary profiles activated with clear inputs, outputs, handoffs, and independent review? |
| Product/engineering quality | Are requirements, contracts, tests, security/privacy, accessibility, and rollback appropriate to the mission? |
| Business truthfulness | Are market, value, partnership, performance, or valuation claims sourced and properly qualified? |
| Operational resilience | Are failures observable, recoverable, idempotent where needed, and owned by a named human? |
| Learning discipline | Does the proposed improvement have evidence, a delta, owner, reviewer, acceptance test, and rollback plan? |

## Controlled improvement protocol

An agent may identify an improvement candidate but must not silently mutate the commissioning package, prompts, roles, policies, source classifications, automations, or production configuration. Every candidate requires a change record:

1. **Trigger:** observed failure, recurring ambiguity, missed requirement, new evidence, evaluation result, or founder direction.
2. **Evidence:** source paths/commits, tests, logs, review findings, and affected missions.
3. **Proposed delta:** exact file/contract/role/workflow change and reason.
4. **Impact:** authority, data, privacy, security, cost, business, legal, external-communication, and recovery implications.
5. **Validation:** acceptance test, independent reviewer, and success/failure measure.
6. **Decision:** named human owner approves, rejects, defers, or requests revision.
7. **Promotion:** update the relevant source, open-question register, decision record, backlog, QA/test artifact, and release/checkpoint only after approval.
8. **Observation:** measure whether the change improved the stated condition; roll back or supersede if it did not.

The Human Blockchain source requires answered questions to update the open-question register, decision log, affected canon document, backlog, QA test, and legal issue where relevant. [1]

## Activation gates still open

This package documents the full desired team catalog but does not activate it. Before the first actual team runtime is created, the founder must decide the first mission, first profiles, approved data/tools, runtime path, evaluation threshold, named human owners, and cost/recovery boundaries. Those decisions are recorded as AGENT-001 through AGENT-005 in `01-authority-and-source-load.md`.

## Reference

[1]: https://github.com/donaldhaight/human-blockchain-operating-system/blob/be1725e/docs/50-execution/source-open-questions.md "Open-question conversion rule"
