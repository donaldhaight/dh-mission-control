# Operator Runbook

## Operating responsibility

The operator owns the application’s availability, access posture, source allowlist, schema discipline, and safe progression from synthetic pilot evidence to a future approved architecture decision. This document does not authorize a change to the pilot boundary. Material changes require a documented requirement, architecture delta, and appropriate human approval.

## Current operating profile

| Dimension | Current configuration |
|---|---|
| Application type | Full-stack internal web application. |
| Authentication | Managed Manus OAuth and server-side protected procedures. |
| Application model | React client, Express/tRPC server, Drizzle ORM, MySQL/TiDB. |
| File handling | Managed object storage for bytes; relational records store metadata and references only. |
| Agent behavior | Structured source-cited draft and review preparation only; no autonomous consequential action. |
| Runtime | Managed autoscaling web runtime; no persistent cloud computer or background worker is provisioned. |
| Data boundary | Synthetic-only pilot records and files. |

## Local development and verification

Run commands from the project root:

```bash
pnpm test
pnpm check
pnpm build
```

The test suite covers policy validation, authentication boundaries, active-context behavior, human decision resolution, dashboard composition, safety-scan alert selection, and duplicate-trigger handling. A production build must pass before saving a delivery checkpoint.

For a development server, use the project’s standard development command. Use the managed preview rather than binding a secondary local listener. If the app becomes unresponsive, inspect the project’s `.manus-logs/` files and restart the managed development service rather than creating an ad hoc background process.

## Access administration

The base account role is managed through the authenticated user record. Mission Control additionally requires a **user context** that binds a user to an organization, legal entity, stakeholder group, human role, access level, and the `syntheticOnly` flag. The active context must belong to the current user.

Never grant a context simply to make an error state disappear. Before granting or changing access, confirm the organization, entity, group, role, data classification, required actions, and decision owner. Record the requirement and resulting architecture delta in the living requirements register.

## Source allowlist administration

The approved source catalog is deliberately explicit. It currently supports the reviewed Human Blockchain repository paths named in `shared/missionControl.ts` and cataloged server-side in `server/missionControl.ts`.

To add a path, first review the source for scope, provenance, currentness, classification, and conflicts with existing instructions. Then update the shared allowlist and server source catalog together, add an evaluation case, update the Q&A register, and obtain the required governance approval. Do not implement broad path patterns or arbitrary repository browsing in the synthetic pilot.

## Database changes

Use the schema-first process:

1. Amend `drizzle/schema.ts` and the relevant shared contract.
2. Generate a migration using `pnpm drizzle-kit generate`.
3. Review generated SQL for destructive statements, identifier length, foreign-key ordering, and indexes.
4. Apply approved migration SQL through the managed database workflow.
5. Record the applied migration in the Drizzle ledger if the workflow requires reconciliation.
6. Add/adjust tests, run the validation suite, and document the change.

Do not store file bytes in database columns. Do not introduce non-synthetic seed records. Avoid destructive changes until a recovery strategy and explicit approval exist.

## Notification operations

Safety scans and protected operations can queue owner alerts for a pending decision gate, SLA risk, missing evidence, failed evaluation, or missing independent review. Alert records are deduplicated at the trigger level. A notification delivery status of `failed` is a review item, not evidence that the underlying risk is resolved.

When a notification fails, inspect its related record, delivery configuration, and audit history. Resolve the delivery issue or record a manual-review exception. The application does not send customer, prospect, regulator, or public communications.

## Incident triage

| Symptom | Operator response |
|---|---|
| Authorization denied | Confirm sign-in, user context ownership, synthetic flag, and intended role. Do not bypass. |
| Protected query error | Capture the route, timestamp, and correlation/audit context; check server and browser logs; retry only after diagnosis. |
| Duplicate alert | Verify the trigger uniqueness constraint and related record; retain one valid synthetic alert and correct the generation path. |
| Missing evidence alert | Attach permitted synthetic evidence or revise the work contract; do not attach live material. |
| Failed evaluation | Read the findings, create a reviewable improvement candidate, and route through a human decision gate. |
| Persistent-runtime request | Treat as a new architecture decision; identify workload, data classification, owner, recovery, cost, and human oversight before provisioning. |

## Backup, recovery, and continuity

The codebase is versioned through checkpoints and its linked source repository. Relational data and object storage require separate operational backup and recovery planning before the system leaves synthetic pilot use. Do not assume a source-code checkpoint restores database rows or object bytes. A production-readiness decision must name the backup owner, recovery target, retention policy, and test cadence.

