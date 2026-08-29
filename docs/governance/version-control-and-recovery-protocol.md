# DH Mission Control Version-Control and Recovery Protocol

**Status:** Interim operational control
**Applies to:** [`donaldhaight/dh-mission-control`](https://github.com/donaldhaight/dh-mission-control)
**Purpose:** Protect a private application repository until enforceable default-branch rules are available on the current GitHub plan.

## Why this protocol exists

The DH Mission Control repository is private and its `main` branch is the stable source-of-truth branch. During the August 29, 2026 verification, GitHub reported that native private-repository branch protection was unavailable on the current plan. This protocol is therefore a procedural safeguard, **not** a substitute for enforceable branch protection. The repository owner should enable an enforceable branch rule or ruleset as soon as the account plan supports it.

## Branch roles

| Branch type | Purpose | Direct-push rule | Promotion requirement |
|---|---|---|---|
| `main` | Reviewed stable baseline and recoverable releases. | Avoid direct work commits except an emergency recovery expressly recorded in a decision note. | Local test/type/build checks; reviewed diff; named checkpoint/release note. |
| `experiment/<topic>` | Reversible research, architecture, and synthetic-pilot experimentation. | Permitted for the assigned experiment. | Must not change live, regulated, financial, external-communication, or production-access behavior. |
| `feature/<topic>` | Bounded application enhancement. | Permitted for the assigned feature. | Written acceptance criteria, tests, safety review, and documented human approval where consequential. |
| `fix/<topic>` | Targeted repair. | Permitted for the assigned repair. | Reproduction evidence, regression test where practical, and a release note. |

## Required promotion sequence

1. Begin on a named `experiment/`, `feature/`, or `fix/` branch. State the purpose, safety boundary, and acceptance criteria in the issue, decision note, or project checklist.
2. Keep the change small enough to review. Do not mix source retrieval, architecture changes, database schema changes, external integrations, and production activation in one unreviewed commit.
3. Before promotion, run the relevant test suite, TypeScript check, and production build. For UI work, perform a desktop and mobile review. For schema work, review and record the migration before application.
4. Review `git diff main...HEAD`, confirm that no secret, raw personal data, file byte payload, or unapproved external action is included, and update the documentation/traceability record.
5. Create or update the managed application checkpoint when the application state must be recoverable through the managed environment. Git and managed checkpoints protect different layers; retain both.
6. Merge or fast-forward into `main` only after the named human owner approves the promotion. Record the commit ID, decision, test evidence, and rollback choice.
7. Push the resulting `main` commit to GitHub. For a meaningful stable baseline, create an annotated release tag using the agreed naming scheme (for example, `v0.2.0-mission-control-pilot`).

## Emergency recovery

If a change breaks the application, first identify the last known-good managed checkpoint and Git commit. Use the managed checkpoint mechanism to restore the app environment when appropriate; use Git history to restore source state through a new recovery commit or protected rollback procedure. Do not rewrite published history or use destructive history-reset operations as a routine recovery method. Preserve a brief incident note describing the broken behavior, affected version, chosen recovery point, and prevention action.

## Asset boundaries

| Asset | Primary recovery method | Git requirement |
|---|---|---|
| Application source, schema, migrations, tests, and documentation | Private GitHub repository plus managed application checkpoint. | Commit and push reviewed source; tag milestones. |
| Human Blockchain source material | Human Blockchain Operating System knowledge repository. | Cite path and commit; do not duplicate or silently alter source status. |
| DH operating architecture and reusable skills | DH Manus Operating System repository. | Preserve cross-repository provenance and version reference. |
| Database rows | Managed database recovery/export procedure. | Track schema/migrations and recovery runbook; never commit raw production data. |
| Object-storage file bytes | Managed storage inventory and recovery procedure. | Track metadata contract and manifests; never commit raw file bytes. |
| Secrets and provider configuration | Controlled secret/configuration inventory. | Commit only names, ownership, rotation/recovery process, and non-sensitive configuration contracts. |

## Replacement criterion

This interim protocol is superseded only when the repository has an enforceable `main`-branch rule or ruleset with evidence of at least: blocked force pushes/deletions, required review or owner approval, and required successful validation checks. Record that evidence in the November readiness audit and update this document.
