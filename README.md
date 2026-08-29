# DH Manus Operating System — Mission Control

## Purpose

This is the authenticated **synthetic-only Mission Control pilot** for the DH Manus Operating System. It gives internal operators a single interface for stack readiness, experiments, requirements, approved source context, evidence references, bounded agent work, independent reviews, decision gates, owner alerts, and audit history.

The application implements a synthetic **Lead → Task → Evidence → Review → Founder Decision** loop. It is deliberately a controlled pilot, not a public product or a production automation system.

## Safety Boundary

The protected server enforces the following pilot controls:

| Control | Enforcement |
|---|---|
| Synthetic-only operations | All seeded work and accepted file references are marked synthetic-only. Live financial, regulated, external-communication, and production-access actions are outside the available server contracts. |
| Explicit active authority | Protected work requires an authenticated user with an active organization, legal entity, stakeholder group, and human role context. |
| Approved source paths | Context packs reject paths outside the reviewed Human Blockchain repository allowlist. Sources retain a status label and new proposals remain separate. |
| Human decision gates | Agents can prepare drafts; an authorized human must approve, reject, defer, or request revision with a recorded rationale. |
| Evidence provenance | File bytes are stored through managed object storage; the database stores only references and structured provenance metadata. |
| Controlled alerts | Safety scans create deduplicated owner alerts for decision gates, failed evaluations, missing evidence, SLA risks, and manual-review exceptions. |

## Technical Shape

The pilot uses React, Tailwind, TypeScript, tRPC, Manus OAuth, Drizzle, MySQL/TiDB, and managed object storage. The database schema resides in `drizzle/schema.ts`; protected operational procedures are organized under `server/missionControl.ts` and `server/routers/missionControl.ts`.

The scope manual at [`docs/mission-control-pilot-manual.md`](docs/mission-control-pilot-manual.md) is the governing design reference. Shared input schemas and synthetic-pilot validation helpers reside in [`shared/missionControl.ts`](shared/missionControl.ts).

## Application Documentation

The complete operational documentation is organized under [`docs/mission-control/`](docs/mission-control/). Start with the [documentation index](docs/mission-control/README.md), then use the user guide, operator runbook, architecture/data reference, safety/change-control guide, and testing/release guide for the relevant role and task.

## Open Knowledge Bundle

The portable, one-folder knowledge package for Mission Control and the proposed agent-team/orchestration model is under [`docs/open-knowledge-bundle/`](docs/open-knowledge-bundle/). Its [index](docs/open-knowledge-bundle/README.md) separates implemented app behavior, Human Blockchain source material, new proposals, and unresolved agent-team requirements.

## Source Repositories and Recovery Boundaries

This application is backed up in the private [`donaldhaight/dh-mission-control`](https://github.com/donaldhaight/dh-mission-control) repository. It is the authoritative Git repository for this application’s source code, schema and migrations, tests, application documentation, and release history.

The private [`donaldhaight/human-blockchain-operating-system`](https://github.com/donaldhaight/human-blockchain-operating-system) repository is the source-grounded Human Blockchain knowledge library. The private [`donaldhaight/dh-manus-operating-system`](https://github.com/donaldhaight/dh-manus-operating-system) repository holds reusable DH Manus Operating System architecture, skill, research, and commissioning materials. Changes to one repository do not silently alter the others; cross-repository use must retain source path, commit reference, source status, and a human-reviewed decision record.

Git does not store database rows, managed object-storage bytes, live secrets, or external-provider configuration. Those assets require separate inventory, access control, retention, and recovery procedures before production use.

## Local Validation

Run the following from the project root after a change:

```bash
pnpm test
pnpm check
pnpm build
```

The policy suite verifies approved source-path restrictions, active authority context, requirements validation, human decision rationale, synthetic-only action blocking, readiness calculation, and the notification eligibility matrix.

## Database Changes

Follow the schema-first workflow. Amend `drizzle/schema.ts`, generate a migration with `pnpm drizzle-kit generate`, review its SQL, and apply it using the managed schema-migration workflow. Do not store file bytes in the database, and do not seed non-synthetic records.

## Current Pilot Limitations

This release intentionally does not provision a cloud computer, persistent workers, external action adapters, live semantic retrieval, or unrestricted multi-agent autonomy. These remain future architecture decisions subject to a documented requirement, evidence, and explicit human approval gate.
