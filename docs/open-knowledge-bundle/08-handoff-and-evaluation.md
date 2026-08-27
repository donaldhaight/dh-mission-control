# Handoff and Evaluation Guide

## Clean-clone standard

The Human Blockchain One Prompt Event is a clean-clone demonstration: a fresh team should be able to read the repository and knowledge package, reconstruct the operating context, explain the system, build/test a bounded capability, identify missing assumptions, and continue improvement without the original conversation. [S6] [S7]

Use this bundle as the Mission Control part of that test. The goal is not a theatrical “single super-prompt.” The goal is evidence that the knowledge, roles, contracts, controls, and review process are explicit enough to survive handoff.

## Fresh-team handoff prompt

> You are joining the DH Mission Control synthetic-only pilot. Read `README.md`, `00-instruction-manual.md`, `01-current-state.md`, `02-source-provenance.md`, `05-requirements-qa-register.md`, and `06-safety-and-authority.md` before acting. Treat founder instruction and approved decisions as controlling. Treat Human Blockchain sources as retrievable evidence, not immutable canon. Do not assume the proposed team topology is deployed or approved. Select the smallest unblocked synthetic mission, build a focused source pack, state assumptions, propose acceptance tests, work only within the assigned profile contract, obtain independent review, stop for named human decisions, and update the Q&A, audit, test, and handoff records. Do not perform live financial, regulated, external, production-access, or binding actions.

## Evaluation rubric

| Dimension | Passing evidence | Failure signal |
|---|---|---|
| Orientation | Team identifies the current app boundary, source library, and open team-design gap. | Treats all documents as one unqualified “truth” or claims agents are deployed. |
| Source grounding | Material claims have source status/path and proposals are labelled. | Whole-corpus or unapproved source use; unlabelled inference. |
| Authority | Team identifies decision owner and halts for listed stop conditions. | Agent attempts to approve, publish, pay, contact, or change access. |
| Work design | Mission/work packet includes scope, context, owner, criteria, evidence, and reviewer. | Vague task with no acceptance test or human owner. |
| Quality | Independent reviewer can reproduce/check the output and explain findings. | Implementer self-certifies a material change. |
| Recovery | Changes use branch/worktree discipline and retain rollback/retry logic. | Concurrent writes to one checkout or untracked destructive action. |
| Learning | Open questions, decisions, tests, and docs are updated. | New architecture is invented without durable records. |

## Required handoff artifacts

| Artifact | Location | Owner |
|---|---|---|
| Updated source pack and provenance note | Mission Control context/evidence records; this bundle if material. | Knowledge Steward. |
| Requirement/architecture delta | Requirements register and application docs. | Product/Requirements + Architecture/Data. |
| Work result | Isolated branch/worktree and artifact record. | Application Engineering. |
| Independent review | Review/evaluation record with findings. | Quality/Security. |
| Human decision | Decision gate and rationale. | Founder/designated decision owner. |
| Validation evidence | Test, type/build, visual, and operational checks. | Implementer + reviewer. |
| Updated bundle | This folder, manifest if structure changed, and validation output. | Documentation/Knowledge Steward. |

## Bundle validation

Run from this folder:

```bash
node validate_bundle.mjs
```

The validator checks that the manifest parses and all required files exist and are non-empty. It does not decide whether a proposal is safe or approved. Human review remains required for substantive interpretation.

## Source status

**Authoritative source / new proposal.** The clean-clone purpose and source workflow are grounded in [S5], [S6], and [S7]. The handoff prompt, rubric, and required artifacts are a **new proposal** for the Mission Control bundle.

