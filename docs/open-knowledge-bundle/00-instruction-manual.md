# Instruction Manual

## Purpose

Use this bundle to orient a human reviewer or a fresh agent team before any DH Mission Control work. Its job is to answer five questions: **what exists, what is sourced, what is proposed, what is unresolved, and what is safe to do next**.

## Required operating sequence

1. Read `README.md`, `01-current-state.md`, and `06-safety-and-authority.md` before changing software, policy, context sources, or automation.
2. Read `02-source-provenance.md` before relying on an agent-team statement as Human Blockchain source guidance.
3. Read `05-requirements-qa-register.md` before deciding that an open requirement is settled.
4. For work involving teams or routing, read `03-agent-team-operating-model.md` and `04-orchestration-contracts.md`.
5. Perform only the smallest coherent, reversible action that advances the current approved milestone.
6. Record new assumptions, design changes, checks, and unresolved questions in the appropriate register before handoff.

## Content-status rules

| Status | Meaning | How to use it |
|---|---|---|
| **Implemented / verified** | Exists in the current Mission Control code and has stated validation evidence. | May be operated within its documented synthetic-only limits. |
| **Authoritative source** | Directly supported by controlling Human Blockchain material. | Follow unless superseded by a higher-authority founder instruction or approved decision. |
| **Working model** | Current practical interpretation that may change with evidence. | Use carefully; preserve underlying source and uncertainty. |
| **New proposal** | A bundle-created recommendation, including the starter team topology. | Review, test, and obtain the appropriate decision before treating it as configuration. |
| **Open requirement** | A decision not yet made or evidence not yet gathered. | Do not silently select a default that changes authority, data use, cost, or autonomy. |

## Source discipline

When a source is material to a decision, record the Human Blockchain repository path, retrieval anchor, relevant excerpt/line range, source status, and any conflict. Do not load the full corpus into every task. Assemble a focused source pack for the mission, preserve citation identifiers, and state the boundary of what was not reviewed.

## Change discipline

Create or update a requirement before implementing a material change. A material change includes a new agent capability, context source, scheduled process, external integration, data class, production permission, cost commitment, model/provider, or approval threshold. A change is not complete until the implementation, tests, documentation, source status, and audit/handoff record agree.

## When to stop and ask the founder

Stop for a named founder decision if the work would change legal authority, ownership, money movement, access to production systems, public/external communication, use of regulated/private information, an external integration, persistent runtime spending, or the operating model. The agent team may prepare decision-ready options but may not decide these matters autonomously.

## Update protocol

Preserve original sources unchanged. Append raw evidence and historical context. Update the current working model and bundle synthesis when a new founder decision or observed result supersedes it. Update `manifest.json` and run `node validate_bundle.mjs` when the bundle structure changes.

## Source status

**Working model.** This file operationalizes the source preservation, human authority, Git continuity, and change-control rules recorded in [S1], [S2], and [S5]. See `02-source-provenance.md`.

