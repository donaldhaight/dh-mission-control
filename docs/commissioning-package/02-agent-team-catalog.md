# Agent Team Catalog

## Design principle

The desired system includes a research team, a MetaGPT-like software team, business-development support for every needed department, and specialist agents that can grow with the enterprise. The correct implementation is a **catalog of purpose-led profiles and cells**, not an always-running swarm. A profile becomes an active agent only when a specific mission assigns its authority context, sources, tools, output, reviewer, budget/cost boundary, and human gate.

This preserves the Human Blockchain source principle: every Company Admin can be supported by an agent that prepares, monitors, retrieves, detects, recommends, and explains, while humans remain accountable and agents do not independently bind the company or perform protected acts. [1]

## Core operating cells

| Cell | Mission | Required outputs | Hard boundary |
|---|---|---|---|
| **Kimosabe / Mission Orchestration** | Convert founder intent into bounded mission packets; coordinate cells; preserve context and escalation. | Mission plan, work routing, status, decision packets, handoff. | Does not become the legal, financial, or production authority. |
| **Knowledge and Research** | Retrieve, classify, compare, and synthesize approved sources; conduct bounded market, technical, and domain research. | Source ledger, research brief, evidence map, assumptions, open questions. | No unsupported claims or external outreach without approval. |
| **Product and Requirements** | Translate needs into PRD, SRS, stories, state/event models, acceptance tests, and roadmap decisions. | Requirements, backlog, traceability, acceptance criteria. | Cannot settle disputed business/legal meaning alone. |
| **MetaGPT-like Software Delivery** | Plan, architect, model data, implement, test, document, review, and deploy bounded software changes. | Design, migration, code, tests, review, deployment/recovery record. | Separate implementation from independent review; no protected deploy without gate. |
| **Assurance and Control** | Independently test quality, source grounding, security/privacy, accessibility, safety, and release readiness. | Evaluation record, risk register, pass/fail evidence, remediation list. | Cannot waive a material risk; must escalate. |
| **Company Admin Support** | Help each operating company monitor commitments, tasks, evidence, and exceptions within its own context. | Drafts, task suggestions, summaries, missing-evidence alerts, recommendations. | No binding offer, money, authority, coverage, legal, or permission change. |

## Research team profile library

| Profile | Purpose | Typical trigger | Reviewer |
|---|---|---|---|
| Domain Research Agent | Clarify restoration, claims, construction, stakeholder, and workflow realities. | Requirement ambiguity or workflow design. | Product owner and domain lead. |
| Market and Competitive Intelligence Agent | Map market actors, alternatives, demand signals, channels, and evidence. | Opportunity, funnel, or positioning mission. | Founder/business-development owner. |
| Research Methods and Evidence Agent | Check source quality, contradictions, citation completeness, and reproducibility. | Material research synthesis. | Independent assurance cell. |
| Knowledge Steward Agent | Maintain source inventories, provenance, retrieval packs, and learned artifacts. | Any source-grounded mission. | Mission owner. |

## MetaGPT-like software team profile library

| Profile | Purpose | Required handoff | Independent check |
|---|---|---|---|
| Product Agent | Defines the smallest useful capability and acceptance tests. | PRD and scenario set. | Product/requirements review. |
| Architecture and Data Agent | Defines boundaries, state/event model, schema, interfaces, and non-functional requirements. | Architecture decision and data contract. | Security/data review. |
| Application Engineering Agent | Implements approved work in an isolated branch/worktree. | Code, migration, test notes, limitations. | QA/security review. |
| Integration and Automation Agent | Designs idempotent, observable adapters and jobs. | Trigger/data/action contract and recovery plan. | Authority and operations review. |
| QA and Security Agent | Runs acceptance, regression, security/privacy, and abuse-case checks. | Evaluation result and defects. | Independent of implementation. |
| Documentation and Release Agent | Updates user/operator/architecture/change records and release package. | Traceability, runbook, release note. | Mission owner. |

## Business-development department profile library

| Department cell | Purposeful contribution | Allowed outputs | Never autonomous |
|---|---|---|---|
| Market Intelligence | Segment audiences, needs, competitors, and market evidence. | Research, hypotheses, source packs. | Market/public claims. |
| Brand, Content, and Cultural Catalog | Turn approved strategy into source-grounded content plans and drafts. | Content calendar, drafts, asset briefs. | Publication or rights grants. |
| Demand Generation and Domain Portfolio | Match domains, audiences, needs, funnel paths, and attribution. | Landing-page briefs, experiment plans, metrics. | Public launch or automated funnel activation. |
| Partnerships and Supplier Development | Prepare partner maps, criteria, and outreach drafts. | Due-diligence briefs, draft communications. | External contact, agreement, or commitment. |
| Sales Enablement and Offer Support | Prepare qualified-lead summaries, offer-support materials, and task handoffs. | Internal drafts, routing recommendations. | Binding offer, price, acceptance, or insurer submission. |
| Customer Success and Support | Prepare status explanations, training, help content, and escalation summaries. | Draft responses, knowledge articles, task routing. | User decisions, regulated advice, or representations. |
| Revenue Operations and Performance | Measure SLA, pipeline, attribution, evidence completeness, and improvement hypotheses. | Dashboards, forecasts marked as scenarios, exception queues. | Money movement, compensation, ratings, or adverse actions. |

## Specialist profile library

Specialist profiles may be activated only when their work is actually needed: legal-review preparation, finance-support preparation, privacy/security, accessibility, data stewardship, valuation-support research, publishing/IP organization, creative production, and local-jurisdiction/domain expertise. A support agent may prepare evidence and questions for qualified professionals; it must not impersonate professional judgment, approve a transaction, or create external obligations.

## Activation ladder

1. **Documentation-only:** Profiles help organize and draft from approved sources.
2. **Synthetic mission support:** Profiles work on labeled synthetic inputs and produce reviewed internal artifacts.
3. **Read/draft/recommend in a scoped company context:** A Company Admin agent monitors state and prepares recommendations.
4. **Narrow delegated action:** Only after explicit legal/operational approval, tested controls, auditability, reversibility, and named human accountability.

No profile should advance automatically from one stage to the next.

## References

[1]: https://github.com/donaldhaight/human-blockchain-operating-system/blob/be1725e/docs/00-start-here/master-continuity-brief.md "Company Admin and agent boundaries"
