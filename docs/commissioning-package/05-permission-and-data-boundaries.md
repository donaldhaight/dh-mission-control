# Permission and Data Boundaries

## Permission model

Every action requires an explicit active context: natural-person or service identity; stakeholder group; legal entity; human role; scoped permission; object/state; agreement/SLA; evidence; and decision/reversal path. The system must not infer authority from an agent name, dashboard visibility, or access to a source file. [1]

| Capability | Documentation-only | Synthetic pilot | Live/production |
|---|---|---|---|
| Read approved repository sources | Allowed from approved context pack. | Allowed from approved context pack. | Requires documented source classification/access rule. |
| Create drafts and analysis | Allowed, clearly labeled. | Allowed, clearly labeled. | Allowed only within approved entity/data context. |
| Write code/docs in isolated branch | Allowed. | Allowed. | Allowed with review/change policy. |
| Create internal task recommendation | Allowed. | Allowed. | Requires user/entity context and policy. |
| Upload evidence/source files | Metadata/provenance required. | Managed storage reference, synthetic label. | Consent, privacy, retention, and access policy required. |
| Send external communication | Prohibited unless a human approves and sends. | Prohibited. | Requires authorized workflow, audit, and human/qualified review. |
| Bind agreement, accept offer, set price, move money, change ownership | Prohibited. | Prohibited. | Named human authority plus qualified/legal/provider controls. |
| Change production permission, deploy, or activate persistent automation | Prohibited. | Prohibited except synthetic test environment. | Formal change/release gate required. |

## Data classes

| Class | Examples | Agent treatment |
|---|---|---|
| Public/repository working knowledge | Approved published or internal source files. | Use only approved paths and preserve source status. |
| Internal working data | Synthetic mission records, internal plans, architecture artifacts. | Use in scoped workspace; retain provenance. |
| Restricted business data | Customer, claim, policyholder, employee, vendor, account, or contract data. | Do not ingest or use until privacy, consent, retention, entity, and access policy are approved. |
| Regulated/consequential data | Financial, underwriting, payment, tax, legal, insurance, securities, or identity-verification data. | Prohibited in current pilot; requires qualified review and specifically approved workflow. |

## Tool and runtime rule

A team profile receives only tools needed for its current work packet. Tool access is deny-by-default. A source-retrieval tool is not external-action authority; a code-writing tool is not deployment authority; a messaging connector is not a publishing authority. Persistent compute, scheduled jobs, integrations, webhooks, and model calls require their own workload, cost, security, data, recovery, and human-gate record before activation.

## Reference

[1]: https://github.com/donaldhaight/human-blockchain-operating-system/blob/be1725e/docs/00-start-here/master-continuity-brief.md "Universal operating model and company agent boundaries"
