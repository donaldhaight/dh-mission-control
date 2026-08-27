# User Guide

## Who may use this application

DH Mission Control is for authenticated internal users. Each protected view displays the **active organization, legal entity, stakeholder group, and human role** before an operational action is available. A user can only select an active context assigned to that user. The pilot uses a clearly labeled synthetic entity context.

## Start here

Sign in through the application’s internal access flow. After sign-in, the **Mission Control** view is the operational home page. If no authorized synthetic context is available, the application displays an authorization-denied state rather than exposing operational data.

The persistent warning banner is intentional:

> **Synthetic-only pilot boundary.** No live financial, regulated, external-communication, or production-access action is available. Drafts, reviews, and context packs remain internal and human-gated.

## Navigation

| View | What it answers | Permitted pilot activity |
|---|---|---|
| **Mission Control** | What is ready, what is at risk, and what does the founder need to do next? | View readiness, experiments, risks, safety controls, and a pending decision packet. Run a safety scan. |
| **Requirements** | Which questions and answers are changing the architecture? | Read the living Q&A register, its evidence paths, status, priority, and resulting architecture delta. |
| **Missions & work** | What bounded work is underway and what artifact contract governs it? | Review missions, work items, artifact contracts, drafts, and independent reviews. Generate a structured draft from an approved context pack. |
| **Context & evidence** | Which approved sources ground the work, and what evidence is attached? | Assemble an approved context pack and upload synthetic evidence with provenance metadata. |
| **Governance** | What must a named human decide, and what signals require review? | Record an approval, rejection, deferment, or revision request with rationale. Review evaluations, notifications, and audit history. |

## Core workflow

### 1. Confirm the active authority context

Before beginning, inspect the context card at the top of any protected view. It states the current organization, legal entity, stakeholder group, and role. Use the selector only to switch to another context available to your authenticated account. A context change is recorded in the audit trail.

### 2. Review the founder’s next action

The Mission Control overview presents stack readiness, active experiments, open risks, pending gates, and the highest-priority founder action. Select **Review gate** to open the Governance decision packet. Do not treat a dashboard recommendation as permission to perform any action outside the synthetic pilot.

### 3. Assemble a source-grounded context pack

In **Context & evidence**, choose only listed approved Human Blockchain repository paths. Each selected path retains a source-status label. Write new thinking in the **New proposal** field; the system retains it separately from source material. The server rejects repository paths outside the allowlist.

### 4. Attach synthetic evidence

Use **Upload synthetic evidence** only for permitted pilot material. File bytes are stored in managed object storage; the transactional database stores provenance, sensitivity, source type, name, and the storage reference. Do not upload live customer data, regulated material, financial records, secrets, production exports, or any material whose classification is uncertain.

### 5. Generate and review a draft

In **Missions & work**, select **Generate draft** only after the work item has an approved context pack. The server produces a structured, source-cited draft record, citations, and an `under_review` artifact state. An independent review is a separate protected procedure that records the reviewer team, verdict, and findings. A draft remains a proposal; it does not change a consequential state or initiate an external action.

### 6. Resolve a human gate

In **Governance**, read the decision question, linked evidence, and required rationale. A designated decision owner may select **Approve**, **Request revision**, or **Defer**. The server records the decision and audit event. An approval of the pilot boundary does not authorize any live activity; it only resolves the named synthetic decision packet.

### 7. Run a safety scan

The **Run safety scan** control checks for pending decision gates, approaching gate deadlines, missing evidence, failed evaluations, and artifacts that require an independent review. The scan creates deduplicated owner-alert records. Review alerts in Governance and resolve their underlying condition; do not suppress an alert merely to clear the queue.

## Reading statuses

| Status family | Meaning |
|---|---|
| `synthetic_only` | The object is constrained to the pilot and must not be treated as live operational data. |
| `authoritative_source`, `working_model`, `historical_context` | The provenance status of context; these are not interchangeable. |
| `new_proposal` | New thinking or generated material that is not source material and requires review. |
| `pending`, `approved`, `rejected`, `deferred`, `revision_requested` | The state of a human decision gate. |
| `passed`, `failed`, `needs_review` | The state of an evaluation or review record. |

## What to do when something fails

An **authorization-denied** screen means the protected server did not recognize a permitted active context or action. Stop and contact the system owner; do not attempt to bypass access controls. An ordinary error view means a protected data request did not complete. Retry once, then record the time, view, and action attempted for the operator. Do not assume empty content means there are no records.
