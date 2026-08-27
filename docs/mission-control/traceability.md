# Documentation Traceability Matrix

## Purpose

This matrix is the durable content-accuracy check for the DH Mission Control documentation. It maps each guide’s material claims to implemented routes, server behavior, shared policy, schema domains, and validation evidence. It was last reviewed against the current synthetic-only pilot implementation.

## Application and user-workflow traceability

| Documentation section | Implemented evidence | Validation evidence | Audit result |
|---|---|---|---|
| App classification and authenticated access | `client/src/pages/MissionControl.tsx`; `server/routers/missionControl.ts`; `protectedProcedure` on all Mission Control operations. | `server/missionControl.access.test.ts` rejects unauthenticated dashboard and safety-scan calls. | Aligned. |
| Active organization/entity/group/role context | `user_contexts` table in `drizzle/schema.ts`; `getContextById`, `listContexts`, and `setDefaultContext` in `server/missionControl.ts`. | `server/missionControl.service.test.ts` checks authorized context selection and rejection of an unauthorized context. | Aligned. |
| Requirements register | `requirementsRegister` schema; `missionControl.requirements.list/create` procedures. | Shared input schema and policy tests in `server/missionControl.test.ts`. | Aligned. |
| Mission and work-graph view | `missions`, `workItems`, and `getMissionDetail`; `missionControl.missions.list/detail`. | Desktop and mobile rendered review of the Missions view. | Aligned. |
| Approved source-grounded context packs | `sourcePathSchema`, `isApprovedSourcePath`, `createContextPack`, `contextPacks`, and `contextPackSources`. | Source-path acceptance/rejection tests in `server/missionControl.test.ts`. | Aligned. |
| Source status versus new proposal | Source-status enums in shared/schema contracts; `proposalSummary` and generated artifacts marked `new_proposal`. | Policy/schema tests and rendered Context & evidence review. | Aligned. |
| Synthetic evidence upload | `fileProvenanceInputSchema`, `assertSyntheticFileSensitivity`, `uploadFileReference`, `fileReferences`, and `server/storage.ts`. | Synthetic sensitivity validation tests; rendered upload guidance. | Aligned. |
| Structured draft versus independent review | `generateArtifactDraft` creates a cited `under_review` artifact; `createArtifactReview` separately records an independent review. | Server method review and procedure inventory review. User guide corrected to reflect the two-step behavior. | Corrected and aligned. |
| Human gate resolution | `decisionInputSchema`, `isDesignatedDecisionOwner`, `decideGate`, `decisionGates`, and `decisions`. | `server/missionControl.service.test.ts` asserts owner enforcement, state updates, decision insert, and audit event. | Aligned. |
| Safety scan and owner alerts | `runSafetyScan`, `queueNotification`, `getSafetyScanNotificationTypes`, and notification uniqueness index. | Service test asserts five alert categories and gate-alert deduplication; database control check confirmed one active gate alert. | Aligned. |

## Architecture and data traceability

| Documentation claim | Implementation reference | Audit result |
|---|---|---|
| Modular-monolith pilot | React client, tRPC server, Drizzle schema, and managed runtime run as one application project. | Aligned. |
| Object storage retains bytes; database retains references | `uploadFileReference` calls `storagePut`; `file_references` stores `storageKey` and `storageUrl`, not a BLOB. | Aligned. |
| Synthetic-only data model | `syntheticOnly` or `pilotMode` fields across authority, mission, work, artifact, and gate records; shared `PILOT_MODE`. | Aligned. |
| Audit trail and correlation context | `auditEvents` schema and `audit` calls in context, requirement, context-pack, draft, review, decision, upload, and scan flows. | Aligned. |
| Controlled notifications | `notifications_trigger_uq` index and race-safe `queueNotification` behavior. | Aligned. |
| No cloud computer or persistent worker | No persistent-compute connection, worker process, cloud runtime configuration, or scheduled job is implemented. | Aligned. |

## Safety and governance traceability

| Required boundary | Server/shared enforcement | Validation evidence | Audit result |
|---|---|---|---|
| No live consequential actions | `assertSyntheticPilotAllows` and absence of external-action adapters; synthetic-only gates/artifacts. | Shared policy tests; safety copy visible in every protected view. | Aligned. |
| Only approved paths enter a context pack | `sourcePathSchema` permits specific files or explicit approved documentation prefixes only. | Approved/unapproved path tests. | Aligned. |
| Human review for consequential promotion | `decideGate` checks designated owner and rationale; artifact review is independent. | Owner-resolution service test; rendered Governance view. | Aligned. |
| Error state must not look empty | `MissionControl.tsx` renders loading, ordinary error, and authorization-denied states for overview and protected subqueries. | Type check and rendered view verification. | Aligned. |

## Validation inventory

| Check | Evidence |
|---|---|
| Unit and service suite | `pnpm test`: authentication, policy, protected access, and controlled service-contract tests. |
| Type safety | `pnpm check`. |
| Build | `pnpm build` from the initial pilot delivery validation. |
| Responsive review | Desktop and mobile screenshots of overview, Requirements, Missions, Context & evidence, and Governance. |
| Database control check | Synthetic pending gate, evaluation, audit record, and one deduplicated owner notification verified. |

## Audit protocol for future changes

After a material UI, service, schema, or policy change, update the affected documentation row, link the changed file or behavior, run the specified validation, and record any mismatch before saving a checkpoint. A documentation change that alters a safety or authority claim requires the same governance attention as a code change.

