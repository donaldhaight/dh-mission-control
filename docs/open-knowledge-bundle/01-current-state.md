# Current State and Scope Boundary

## Implemented application

DH Mission Control is an **authenticated internal full-stack web application**. It includes a React user interface, protected tRPC server procedures, a MySQL/TiDB database through Drizzle, managed object-storage references for synthetic files, built-in owner notifications, and a server-side structured drafting pathway. It operates as a modular-monolith pilot.

The current UI supports an overview of stack readiness, active experiments, risks, founder action, active authority context, requirements, missions/work graph, approved source packs, synthetic evidence references, human gates, evaluation records, notifications, and audit history.

## Implemented controls

| Control | Current behavior | Status |
|---|---|---|
| Internal authentication | Mission Control procedures require an authenticated user. | Implemented / verified |
| Active context | User action is associated with organization, legal entity, stakeholder group, and role. | Implemented / verified |
| Synthetic-only pilot | Server inputs and state models restrict the pilot to synthetic work; no live action adapters exist. | Implemented / verified |
| Source packs | Context packs admit only approved Human Blockchain paths; proposals are visibly distinct. | Implemented / verified |
| Evidence | File bytes are stored in managed storage; the database stores provenance/reference data. | Implemented / verified |
| Draft and review | Structured draft preparation and independent-review records are supported as separate protected activities. | Implemented / verified |
| Human gates | A designated decision owner must supply a rationale to resolve a synthetic gate. | Implemented / verified |
| Alerts/audit | Safety scan categories and audit records are persisted; alert triggers are deduplicated. | Implemented / verified |

## Intentionally not implemented

The following are **not** configured, connected, or authorized: a cloud computer/persistent worker, scheduled jobs, arbitrary repository search, vector retrieval, broad agent autonomy, external-action adapters, public/third-party access, live customer or regulated data, financial execution, production permission changes, or external communications. These remain separate architecture decisions.

## Agent-team current state

The application contains team labels such as **Knowledge & Evidence Team** and **Quality & Risk Review Team** to model ownership and independence in the synthetic workflow. These labels are not evidence of deployed independent agents, a runtime scheduler, tool connections, autonomous handoffs, or a production staffing model.

Human Blockchain source material defines a high-level cross-functional team and bounded Company Admin agent role. It also explicitly leaves the question of which AI agents are needed first open. The proposed starter-cell team described in this bundle is therefore a new design recommendation, not present configuration.

## Validation evidence

The current pilot previously passed protected access, policy, service-contract, and notification behavior tests; TypeScript check; production build; database-control verification; and desktop/mobile route review. The app-level documentation includes a detailed testing/release guide and traceability matrix under `docs/mission-control/`.

## Source status

**Implemented / verified** for statements about the Mission Control project. **Authoritative source / open requirement** for the Human Blockchain agent-team gap. See [S2], [S3], and [S4] in `02-source-provenance.md`.

