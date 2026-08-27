# Testing and Release Guide

## Validation standard

Every material change must pass functional, authorization, synthetic-boundary, and presentation checks before it is treated as a reviewable delivery. For the current pilot, a release is a **versioned checkpoint** that can be reviewed or restored; it is not permission to expose the app publicly or to enable live operational actions.

## Required command checks

From the project root, run:

```bash
pnpm test
pnpm check
pnpm build
```

| Check | Purpose | Current coverage examples |
|---|---|---|
| Vitest | Validates deterministic policy and service behavior. | Authentication boundary, active-context authorization, allowlisted source paths, synthetic restrictions, gate-owner enforcement, decision/audit side effects, readiness/founder-action summary, safety-scan alert categories, and deduplication. |
| TypeScript check | Identifies contract mismatches across client, shared inputs, service, and router. | Typed tRPC requests, shared schemas, service overrides used in tests, and UI props. |
| Production build | Confirms the deployable bundle compiles. | Vite client build and bundled server entry. |
| Responsive review | Confirms the internal dashboard is legible and reachable at desktop and mobile widths. | Overview, Requirements, Missions, Context & evidence, and Governance. |
| Database control check | Confirms seeded pilot controls are synthetic and critical alerts are not duplicated. | Pending gate, evaluation, audit record, and notification counts. |

## Minimum test matrix for a new feature

| Area changed | Required test or review |
|---|---|
| Protected procedure | Unauthenticated rejection, permitted role/context behavior, and denied behavior. |
| New data field or relation | Schema migration review, backward-compatibility considerations, and service test. |
| Source retrieval | Approved-path acceptance, unapproved-path rejection, source-status rendering, and citation trace. |
| Agent draft/review | Input contract, explicit proposal/source distinction, independent review rule, and no consequential side effect. |
| Human decision | Named-owner rule, non-empty rationale, status transition, decision record, and audit event. |
| Notification | Trigger condition, deduplication, owner routing, failed-delivery review path, and no external customer/public dispatch. |
| File upload | Synthetic sensitivity enforcement, metadata/reference persistence, managed storage behavior, and no database bytes. |
| Automation/persistent runtime | New requirements and architecture decision before implementation; test idempotency, recovery, observability, and human gate. |

## Visual and accessibility review

Review all protected views at desktop and mobile widths. Verify readable contrast, visible focus behavior, clear control labels, understandable validation feedback, loading/empty/error/denied states, and no reliance on color alone for critical state. Confirm that the synthetic-only warning and active authority context remain visible in each protected workspace.

## Before a checkpoint

1. Review `todo.md` and ensure all completed items are marked complete; add discovered gaps as new unchecked items rather than deleting history.
2. Run the command checks above and record material failures or warnings.
3. Inspect current server, browser, and network logs for unexpected errors.
4. Perform desktop and mobile visual review of all affected routes.
5. Confirm migrations are applied and the Drizzle ledger is synchronized when the schema changed.
6. Update this documentation, the pilot manual, and the Q&A register where the behavior or boundary changed.
7. Save a descriptive checkpoint. Do not publish without a checkpoint and explicit owner direction.

## Release notes template

```markdown
## Release / checkpoint: <name>

### Purpose
<Why this change exists and which requirement it addresses.>

### Functional change
<What a permitted internal user can now do.>

### Safety and authority impact
<What remains blocked, any changed approval rule, and whether synthetic-only scope changed.>

### Data and migration impact
<Tables, fields, migration identifier, and recovery implications.>

### Validation evidence
<Test, type, build, logs, responsive review, and any manual test result.>

### Rollback point
<Prior checkpoint/version and any non-reversible data considerations.>
```

