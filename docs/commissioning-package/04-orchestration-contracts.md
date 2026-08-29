# Orchestration Contracts

## Operating loop

The orchestration layer exists to coordinate purposeful cells, not to make every agent active. The governing loop is:

> **Founder objective → authority/context check → approved source pack → bounded mission → selected cells → artifacts → independent review → human gate → observed result → knowledge, requirements, and evaluation update.**

The Mission Orchestrator may sequence work, assemble status, detect blockers, and recommend the next highest-value unblocked mission. It cannot override a human gate or use an unavailable team/tool/permission merely because a mission is blocked.

## Team-selection rule

| Mission type | Minimum profiles | Optional profiles | Required gate |
|---|---|---|---|
| Source clarification or research | Knowledge Steward + relevant Research profile + independent evidence check. | Domain, market, or research-methods specialist. | Founder review when it changes strategy or public claims. |
| PRD/SRS or operating design | Product + Architecture/Data + independent Assurance. | Knowledge, domain, legal-review preparation. | Founder decision for material model/authority change. |
| Bounded software change | Product + Architecture/Data + Application Engineering + QA/Security. | Integration/Automation, Documentation/Release. | Human promotion after tests/review. |
| Business-development plan/content | Relevant Business Development profile + Knowledge + independent evidence review. | Product, brand, legal-review preparation. | Founder/public-disclosure gate. |
| Company Admin assistance | Company Admin Support + Knowledge; human Company Admin. | Operations, QA. | Company Admin decision; higher gate for restricted actions. |

## Isolation and concurrency

Each work packet has one writing owner. Research/review may run independently, but no two agents may alter the same branch, file set, decision register, or production setting concurrently. Use separate branches or worktrees, merge only reviewed artifacts, and record the source/commit used for synthesis. [1]

## Inter-team dependencies

1. Research establishes evidence; it does not silently decide product scope.
2. Product establishes acceptance conditions; it does not unilaterally decide infrastructure or regulated treatment.
3. Architecture establishes technical boundaries; it does not authorize implementation or release.
4. Engineering produces a change; it does not self-approve a protected promotion.
5. Assurance evaluates the change; it does not waive material legal, financial, privacy, or production risk.
6. Business-development produces internal plans/drafts; it does not make public claims, commitments, or offers without approval.
7. The human decision owner accepts, rejects, defers, or assigns qualified review; no agent substitutes for that accountability.

## Learning and self-improvement

“Self-improvement” means evidence-controlled improvement, not uncontrolled prompt mutation. After a mission, the orchestrator may propose a change to a prompt, role card, workflow, knowledge index, test, or implementation only when it supplies: the observed deficiency; source/evaluation evidence; proposed delta; expected benefit; safety/authority impact; rollback plan; owner; reviewer; and acceptance test. The change remains a candidate until a human gate accepts it.

## Reference

[1]: https://github.com/donaldhaight/human-blockchain-operating-system/blob/be1725e/AGENTS.md "Concurrency and source-control rules"
