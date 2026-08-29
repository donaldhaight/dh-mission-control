# DH Mission Control — Open Knowledge Bundle

> **Purpose.** This folder is a portable, inspectable knowledge package for the DH Mission Control application and the next proposed agent-team design. It is designed for a future human or fresh agent team to understand the current pilot, distinguish verified source guidance from new proposals, identify unresolved requirements, and continue work without relying on this chat history.

## What this bundle is

This is an **open knowledge bundle**, meaning that its contents are organized as plain Markdown and JSON, have an explicit manifest, preserve source pointers and status, and make unresolved decisions visible. It is not a claim that the agent teams described here are deployed or authorized. The application currently implements a synthetic-only, human-gated Mission Control pilot. The team topology in this bundle is a **proposed operating model** derived from source material and open questions.

## Read in this order

| Order | File | Why it matters |
|---:|---|---|
| 1 | [00-instruction-manual.md](00-instruction-manual.md) | Defines how to use, extend, validate, and hand off the bundle. |
| 2 | [01-current-state.md](01-current-state.md) | Separates the implemented app from proposed capabilities. |
| 3 | [02-source-provenance.md](02-source-provenance.md) | Shows exactly which Human Blockchain sources informed the bundle. |
| 4 | [03-agent-team-operating-model.md](03-agent-team-operating-model.md) | Explains the source-grounded and proposed team setup. |
| 5 | [04-orchestration-contracts.md](04-orchestration-contracts.md) | Defines mission packets, handoffs, review, human gates, and audit events. |
| 6 | [05-requirements-qa-register.md](05-requirements-qa-register.md) | Captures answered questions and the missing decisions needed before setup. |
| 7 | [06-safety-and-authority.md](06-safety-and-authority.md) | States the non-negotiable controls and stop conditions. |
| 8 | [07-implementation-and-operations.md](07-implementation-and-operations.md) | Maps the bundle to the app and describes staged activation. |
| 9 | [08-handoff-and-evaluation.md](08-handoff-and-evaluation.md) | Provides clean-clone, evaluation, and continuation instructions. |
| 10 | [09-source-and-open-question-verification.md](09-source-and-open-question-verification.md) | Verifies source claims and open agent-team decisions against their cited Human Blockchain records. |
| 11 | [10-mission-control-pilot-manual-snapshot.md](10-mission-control-pilot-manual-snapshot.md) | Preserves the governing synthetic-pilot scope, glossary, and acceptance criteria in this folder. |
| 12 | [11-commissioning-package-index.md](11-commissioning-package-index.md) | Preserves the self-contained commissioning-package summary and points a connected team to the separate reusable package without making this bundle depend on it. |

## Current truth at a glance

| Area | Current status | Source status |
|---|---|---|
| Mission Control application | Implemented as an authenticated, synthetic-only full-stack internal web application. | **Implemented / verified** |
| Human Blockchain knowledge repository | Available as the authoritative/retrievable domain knowledge library. | **Source-grounded** |
| Cross-functional team roles | Named at a high level in the Human Blockchain continuity brief. | **Source-grounded** |
| Company Admin agent behavior | Read/draft/recommend support mode and explicit authority limits are described. | **Source-grounded** |
| First-agent list | Present but explicitly marked as an open question and “likely” list. | **Source-grounded but unresolved** |
| Detailed team topology, routing, tool permissions, budgets, and schedules | Not yet settled. | **Open requirement** |
| Proposed starter-cell team and orchestration design in this folder | A new, reviewable design proposal. | **New proposal** |
| One-prompt commissioning package | Implemented as a versioned documentation/control package; runtime activation remains governed. | **Implemented package / proposed activation** |

## Fast answer: are agent teams already set up?

**Not as a live runtime.** The source repository provides a valuable foundation: responsibilities for a cross-functional team, bounded Company Admin agents, a One Prompt Event standard, work-flow expectations, and human stop conditions. The separate reusable commissioning package converts that intent into a source-load, team-profile, mission, handoff, gate, and readiness baseline; its self-contained summary is preserved in [11-commissioning-package-index.md](11-commissioning-package-index.md). It does not claim that the teams are provisioned. The final decisions about which profiles run first, their models/tools, cross-agent calls, cost limits, escalation thresholds, and deployment/runtime configuration remain explicit activation decisions. The source open-question register marks “Which AI agents are needed first?” as **OPEN**. See [03-agent-team-operating-model.md](03-agent-team-operating-model.md) and [05-requirements-qa-register.md](05-requirements-qa-register.md).

## Bundle contract

1. Preserve source statements, source paths, commit anchors, and source status. Do not rewrite historical source into a new canonical claim.
2. Label every new design claim as **New proposal**, **Working model**, or **Open requirement**.
3. Treat the founder’s present instruction and approved decisions as higher authority than source material.
4. Do not enable any live, external, regulated, financial, production-access, or binding behavior from this bundle alone.
5. When a decision changes authority, money movement, production access, external claims, or the operating model, stop for a named human decision.
6. Run `node validate_bundle.mjs` after editing the manifest or any bundle file.

## Bundle boundary

The bundle is intentionally self-contained as documentation and metadata. It does not duplicate the Human Blockchain source corpus. Use the source pointers and excerpts in [02-source-provenance.md](02-source-provenance.md) to retrieve controlling Human Blockchain material at the recorded anchor before relying on it for implementation or governance. The Mission Control pilot manual is included as a bundle snapshot for self-contained orientation.
