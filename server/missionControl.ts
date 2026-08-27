import { and, desc, eq, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";
import { listLLMModels, invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";
import type { TrpcContext } from "./_core/context";
import { getDb } from "./db";
import { storagePut } from "./storage";
import {
  artifactCitations,
  artifacts,
  auditEvents,
  contextPackSources,
  contextPacks,
  decisionGates,
  decisions,
  evaluations,
  experiments,
  fileReferences,
  legalEntities,
  missions,
  notifications,
  organizations,
  requirementsRegister,
  reviews,
  risks,
  stackComponents,
  stakeholderGroups,
  userContexts,
  users,
  workItems,
} from "../drizzle/schema";
import {
  APPROVED_CONTEXT_PATHS,
  assertSyntheticFileSensitivity,
  composeDashboardSummary,
  getReadinessScore,
  getSafetyScanNotificationTypes,
  isDecisionGateSlaRisk,
  isDesignatedDecisionOwner,
  type ActiveContextInput,
  isApprovedSourcePath,
  PILOT_MODE,
  requiresManualReviewException,
} from "../shared/missionControl";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

type ServiceOverrides = {
  ensurePilotData?: typeof ensurePilotData;
  getDb?: typeof getDb;
  getContextById?: typeof getContextById;
  prepareMissionControl?: typeof prepareMissionControl;
  audit?: typeof audit;
  queueNotification?: typeof queueNotification;
};

const SOURCE_CATALOG: Record<string, { title: string; excerpt: string; hash: string; status: "authoritative_source" | "working_model" | "historical_context" }> = {
  "README.md": {
    title: "Human Blockchain Operating System — Repository Guide",
    excerpt: "The repository is the living knowledge bundle for the Human Blockchain operating model and its durable operating context.",
    hash: "hbo-readme-be1725e",
    status: "working_model",
  },
  "AGENTS.md": {
    title: "Human Blockchain Operating System — Agent Instructions",
    excerpt: "Agents prepare, analyze, draft, test, and recommend within bounded authority; consequential activity remains behind explicit human approval.",
    hash: "hbo-agents-be1725e",
    status: "authoritative_source",
  },
  "docs/00-start-here/master-continuity-brief.md": {
    title: "Human Blockchain — Master Continuity Brief",
    excerpt: "Start with a modular monolith, typed events, explicit permissions, object storage, and a single end-to-end RRCA loop before scaling infrastructure or autonomy.",
    hash: "hbo-continuity-be1725e",
    status: "authoritative_source",
  },
};

let pilotInitialization: Promise<void> | null = null;

function catalogEntry(path: string) {
  const exact = SOURCE_CATALOG[path];
  if (exact) return exact;
  return {
    title: `Approved Human Blockchain source: ${path.split("/").pop() ?? path}`,
    excerpt: "This approved repository path is included as source context. The pilot records the path and status; additional excerpts must be reviewed before a consequential decision.",
    hash: `approved-${Buffer.from(path).toString("hex").slice(0, 48)}`,
    status: "working_model" as const,
  };
}

function contextLabel(context: {
  organizationName: string;
  legalEntityName: string;
  stakeholderGroupName: string;
  humanRole: string;
}) {
  return `${context.organizationName} · ${context.legalEntityName} · ${context.stakeholderGroupName} · ${context.humanRole}`;
}

function toCorrelationId(prefix: string) {
  return `${prefix}_${nanoid(12)}`;
}

async function audit(
  user: AuthenticatedUser | null,
  activeContextLabel: string,
  eventType: string,
  entityType: string,
  entityId: number | null,
  details: Record<string, unknown>,
  correlationId = toCorrelationId("mc")
) {
  const db = await getDb();
  if (!db) return correlationId;
  await db.insert(auditEvents).values({
    actorUserId: user?.id ?? null,
    eventType,
    entityType,
    entityId,
    correlationId,
    activeContextLabel,
    details,
  });
  return correlationId;
}

async function getContextById(userId: number, contextId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Mission Control database is unavailable.");

  const contextCondition = contextId
    ? and(eq(userContexts.userId, userId), eq(userContexts.id, contextId))
    : and(eq(userContexts.userId, userId), eq(userContexts.isDefault, true));

  const contextRows = await db
    .select({
      id: userContexts.id,
      userId: userContexts.userId,
      organizationId: organizations.id,
      organizationName: organizations.name,
      legalEntityId: legalEntities.id,
      legalEntityName: legalEntities.name,
      stakeholderGroupId: stakeholderGroups.id,
      stakeholderGroupName: stakeholderGroups.name,
      humanRole: userContexts.humanRole,
      accessLevel: userContexts.accessLevel,
      syntheticOnly: userContexts.syntheticOnly,
    })
    .from(userContexts)
    .innerJoin(organizations, eq(userContexts.organizationId, organizations.id))
    .innerJoin(legalEntities, eq(userContexts.legalEntityId, legalEntities.id))
    .innerJoin(stakeholderGroups, eq(userContexts.stakeholderGroupId, stakeholderGroups.id))
    .where(contextCondition)
    .limit(1);

  const activeContext = contextRows[0];
  if (!activeContext) throw new Error("No authorized internal context is available for this account.");
  if (!activeContext.syntheticOnly) throw new Error("This pilot permits synthetic-only active contexts.");
  return { ...activeContext, label: contextLabel(activeContext) };
}

async function ensurePilotDataInternal(user: AuthenticatedUser) {
  const db = await getDb();
  if (!db) throw new Error("Mission Control database is unavailable.");

  let organization = (await db.select().from(organizations).where(eq(organizations.code, "DHMOS-SYN")).limit(1))[0];
  if (!organization) {
    await db.insert(organizations).values({ code: "DHMOS-SYN", name: "DH Manus Operating System — Synthetic Pilot", syntheticOnly: true });
    organization = (await db.select().from(organizations).where(eq(organizations.code, "DHMOS-SYN")).limit(1))[0]!;
  }

  let legalEntity = (await db.select().from(legalEntities).where(and(eq(legalEntities.organizationId, organization.id), eq(legalEntities.code, "RRCA-LAB"))).limit(1))[0];
  if (!legalEntity) {
    await db.insert(legalEntities).values({ organizationId: organization.id, code: "RRCA-LAB", name: "RRCA Synthetic Lab Entity", jurisdiction: "Synthetic / No live jurisdiction", syntheticOnly: true });
    legalEntity = (await db.select().from(legalEntities).where(and(eq(legalEntities.organizationId, organization.id), eq(legalEntities.code, "RRCA-LAB"))).limit(1))[0]!;
  }

  let stakeholderGroup = (await db.select().from(stakeholderGroups).where(and(eq(stakeholderGroups.organizationId, organization.id), eq(stakeholderGroups.code, "FOUNDER-OPS"))).limit(1))[0];
  if (!stakeholderGroup) {
    await db.insert(stakeholderGroups).values({ organizationId: organization.id, code: "FOUNDER-OPS", name: "Founder & Operations", description: "Synthetic internal operating group", syntheticOnly: true });
    stakeholderGroup = (await db.select().from(stakeholderGroups).where(and(eq(stakeholderGroups.organizationId, organization.id), eq(stakeholderGroups.code, "FOUNDER-OPS"))).limit(1))[0]!;
  }

  const existingContext = (await db.select().from(userContexts).where(eq(userContexts.userId, user.id)).limit(1))[0];
  if (!existingContext) {
    await db.insert(userContexts).values({
      userId: user.id,
      organizationId: organization.id,
      legalEntityId: legalEntity.id,
      stakeholderGroupId: stakeholderGroup.id,
      humanRole: user.role === "admin" ? "Founder / Decision Owner" : "Internal Operator",
      accessLevel: user.role === "admin" ? "admin" : "operator",
      isDefault: true,
      syntheticOnly: true,
    });
  }

  const existingComponent = (await db.select().from(stackComponents).limit(1))[0];
  if (!existingComponent) {
    await db.insert(stackComponents).values([
      { name: "Internal access", layer: "Identity & context", status: "testing", readinessScore: 75, owner: "Founder", summary: "Authenticated internal access with explicit synthetic context.", syntheticOnly: true },
      { name: "Evidence registry", layer: "Data & provenance", status: "designing", readinessScore: 55, owner: "Knowledge Team", summary: "Storage references and provenance metadata are prepared for pilot validation.", syntheticOnly: true },
      { name: "Decision gates", layer: "Governance", status: "testing", readinessScore: 70, owner: "Founder", summary: "Approve, reject, defer, and revision-request paths are modeled.", syntheticOnly: true },
      { name: "Bounded agent work", layer: "Agent orchestration", status: "designing", readinessScore: 45, owner: "Mission Control", summary: "Draft and independent-review contracts remain human-gated.", syntheticOnly: true },
      { name: "Notification controls", layer: "Operations", status: "not_started", readinessScore: 25, owner: "Operations", summary: "Owner-facing notifications are queued and testable in the pilot.", syntheticOnly: true },
    ]);
  }

  const existingExperiment = (await db.select().from(experiments).limit(1))[0];
  if (!existingExperiment) {
    await db.insert(experiments).values({
      name: "Synthetic RRCA Lead-to-Task Loop",
      hypothesis: "A source-grounded mission, bounded work item, evidence checklist, independent review, and founder gate can be traced without any live action.",
      status: "active",
      owner: "Founder & Operations",
      successMetric: "One complete synthetic work graph records source, draft, review, decision, and audit linkage.",
      pilotMode: PILOT_MODE,
    });
  }

  const requirementRows = await db.select().from(requirementsRegister).limit(1);
  if (requirementRows.length === 0) {
    await db.insert(requirementsRegister).values([
      {
        code: "INFRA-001",
        category: "Hosting & runtime",
        question: "Did we create a connection to a cloud computer and, if not, why not?",
        answer: "No cloud computer is provisioned. The pilot starts with a protected control plane and synthetic evidence before any always-on workload, data classification, recovery owner, or operating requirement justifies persistent infrastructure.",
        status: "confirmed",
        priority: "P0",
        evidencePaths: ["docs/00-start-here/master-continuity-brief.md"],
        architectureDelta: "Defer persistent compute until an approved workload needs Docker, custom runtime, fixed IP, or continuous execution.",
        sourceStatus: "working_model",
      },
      {
        code: "AUTH-003",
        category: "Authority & controls",
        question: "What decisions can the system prepare, and what decisions may only a named human execute?",
        answer: "Agents may prepare, analyze, draft, test, and recommend. Named humans retain binding, regulated, financial, external-communication, production-access, and material-risk decisions.",
        status: "confirmed",
        priority: "P0",
        evidencePaths: ["AGENTS.md", "docs/00-start-here/master-continuity-brief.md"],
        architectureDelta: "Human decision gates are mandatory before consequential state promotion.",
        sourceStatus: "authoritative_source",
      },
      {
        code: "DATA-005",
        category: "Knowledge retrieval",
        question: "Do we need semantic/vector retrieval in the first slice?",
        answer: "Not by default. The first slice uses reviewed repository paths, status labels, citations, and retrieval evaluation cases before adding broader semantic retrieval.",
        status: "working_assumption",
        priority: "P1",
        evidencePaths: ["docs/00-start-here/master-continuity-brief.md"],
        architectureDelta: "Use an approved-path context pack catalog before vectorization.",
        sourceStatus: "working_model",
      },
    ]);
  }

  let mission = (await db.select().from(missions).where(eq(missions.title, "Synthetic Lead-to-Task Evidence Pilot")).limit(1))[0];
  if (!mission) {
    await db.insert(missions).values({
      organizationId: organization.id,
      legalEntityId: legalEntity.id,
      stakeholderGroupId: stakeholderGroup.id,
      title: "Synthetic Lead-to-Task Evidence Pilot",
      objective: "Prove the internal Mission Control loop using a synthetic intake, attributable task, evidence checklist, independent review, and founder gate.",
      successMeasure: "An authenticated internal user can trace the synthetic record from source-grounded context to founder decision without a live action.",
      owner: "Founder & Operations",
      nextFounderAction: "Review the G0 hosting-control decision packet and retain synthetic-only mode for the first loop.",
      status: "review",
      pilotMode: PILOT_MODE,
    });
    mission = (await db.select().from(missions).where(eq(missions.title, "Synthetic Lead-to-Task Evidence Pilot")).limit(1))[0]!;
  }

  let contextPack = (await db.select().from(contextPacks).where(eq(contextPacks.missionId, mission.id)).limit(1))[0];
  if (!contextPack) {
    await db.insert(contextPacks).values({
      missionId: mission.id,
      title: "RRCA Pilot Source Pack",
      proposalSummary: "New proposal: validate one internal synthetic workflow before enabling external integrations or persistent agent workers.",
      sourceStatus: "authoritative_source",
      status: "approved",
      assembledBy: "Mission Control",
    });
    contextPack = (await db.select().from(contextPacks).where(eq(contextPacks.missionId, mission.id)).limit(1))[0]!;
    const paths = ["AGENTS.md", "docs/00-start-here/master-continuity-brief.md"];
    await db.insert(contextPackSources).values(paths.map(repositoryPath => {
      const entry = catalogEntry(repositoryPath);
      return { contextPackId: contextPack.id, repositoryPath, sourceTitle: entry.title, sourceStatus: entry.status, excerpt: entry.excerpt, contentHash: entry.hash };
    }));
  }

  let workItem = (await db.select().from(workItems).where(eq(workItems.missionId, mission.id)).limit(1))[0];
  if (!workItem) {
    await db.insert(workItems).values({
      missionId: mission.id,
      title: "Prepare synthetic lead-to-task evidence brief",
      assignedTeam: "Knowledge & Evidence Team",
      objective: "Create a cited pilot brief that identifies the synthetic intake, required evidence, human gate, and prohibited actions.",
      artifactContract: "Structured markdown draft with source citations, assumptions, non-actions, and independent-review requirement.",
      acceptanceCriteria: "Cites approved context pack sources, labels proposal content, remains synthetic-only, and is independently reviewed.",
      status: "awaiting_review",
      requiresIndependentReview: true,
      syntheticOnly: true,
    });
    workItem = (await db.select().from(workItems).where(eq(workItems.missionId, mission.id)).limit(1))[0]!;
  }

  const existingArtifact = (await db.select().from(artifacts).where(eq(artifacts.workItemId, workItem.id)).limit(1))[0];
  if (!existingArtifact) {
    await db.insert(artifacts).values({
      workItemId: workItem.id,
      contextPackId: contextPack.id,
      title: "Synthetic Lead-to-Task Evidence Brief",
      artifactType: "evidence_brief",
      content: "## Source-grounded draft\n\n**Observed constraint:** the pilot remains synthetic-only and agents do not promote consequential state.\n\n**New proposal:** run a single attributed Lead → Task → Evidence → Review → Founder Decision loop before enabling external integrations.\n\n**Required evidence:** synthetic intake identifier, task owner, source pack citations, review finding, and named decision record.\n\n**Non-actions:** no financial, regulated, external-communication, or production-access action is permitted.\n\n**Citations:** `AGENTS.md`; `docs/00-start-here/master-continuity-brief.md`.",
      sourceStatus: "new_proposal",
      status: "under_review",
      generatedBy: "Knowledge & Evidence Team",
      syntheticOnly: true,
    });
    const artifact = (await db.select().from(artifacts).where(eq(artifacts.workItemId, workItem.id)).limit(1))[0]!;
    const sources = await db.select().from(contextPackSources).where(eq(contextPackSources.contextPackId, contextPack.id));
    await db.insert(artifactCitations).values(sources.map(source => ({ artifactId: artifact.id, contextPackSourceId: source.id, claimLabel: "observed" as const, citationNote: `Context-pack source: ${source.repositoryPath}` })));
    await db.insert(reviews).values({ artifactId: artifact.id, reviewerTeam: "Quality & Risk Review Team", verdict: "revision_needed", findings: "The brief meets the source and synthetic-only requirements. Add a named decision packet before the work item can close.", isIndependent: true });
    await db.insert(evaluations).values({ missionId: mission.id, artifactId: artifact.id, name: "Citation and synthetic-only review", status: "passed", score: 92, criteria: "Sources, status labels, prohibited actions, and review requirement are present.", findings: "Pass: source paths are approved and the proposed next action remains human-gated.", improvementCandidate: "Add a decision-packet template to reduce manual completeness checks." });
  }

  const existingGate = (await db.select().from(decisionGates).where(eq(decisionGates.missionId, mission.id)).limit(1))[0];
  if (!existingGate) {
    await db.insert(decisionGates).values({
      missionId: mission.id,
      workItemId: workItem.id,
      title: "G0 — Approve synthetic pilot boundary",
      decisionQuestion: "Should the Mission Control pilot proceed with synthetic data, approved repository paths, no external integrations, and human-only consequential decisions?",
      owner: "Founder / Decision Owner",
      status: "pending",
      dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      syntheticOnly: true,
    });
    const gate = (await db.select().from(decisionGates).where(eq(decisionGates.missionId, mission.id)).limit(1))[0]!;
    await queueNotification("decision_gate", "Founder decision required", "G0 is ready for review. Synthetic-only boundary approval is required before any pilot promotion.", "Founder / Decision Owner", "decision_gate", gate.id);
  }

  const existingRisk = (await db.select().from(risks).limit(1))[0];
  if (!existingRisk) {
    await db.insert(risks).values([
      { missionId: mission.id, title: "Context drift from unapproved sources", description: "A future agent or contributor could attempt to include a repository path that has not been reviewed for the pilot.", severity: "high", status: "open", owner: "Knowledge & Evidence Team", mitigation: "Server-side source allowlisting, context-pack audit, and source-status labels." },
      { missionId: mission.id, title: "Premature consequential automation", description: "An automation could be mistakenly treated as authorization to perform a live action.", severity: "critical", status: "open", owner: "Founder / Decision Owner", mitigation: "Synthetic-only database constraint, server-side action guard, human decision gates, and no external-action adapters in pilot mode." },
    ]);
  }
}

async function ensurePilotData(user: AuthenticatedUser) {
  if (pilotInitialization) {
    await pilotInitialization;
    const db = await getDb();
    if (!db) throw new Error("Mission Control database is unavailable.");
    const existingContext = (await db.select().from(userContexts).where(eq(userContexts.userId, user.id)).limit(1))[0];
    if (existingContext) return;
  }

  pilotInitialization = ensurePilotDataInternal(user);
  try {
    await pilotInitialization;
  } finally {
    pilotInitialization = null;
  }
}

async function queueNotification(
  type: "decision_gate" | "failed_evaluation" | "missing_evidence" | "sla_risk" | "manual_review_exception",
  title: string,
  content: string,
  owner: string,
  relatedRecordType: string,
  relatedRecordId: number
) {
  const db = await getDb();
  if (!db) return null;
  const existing = (await db.select().from(notifications).where(and(eq(notifications.type, type), eq(notifications.relatedRecordType, relatedRecordType), eq(notifications.relatedRecordId, relatedRecordId))).limit(1))[0];
  if (existing) return existing;
  try {
    await db.insert(notifications).values({ type, title, content, owner, relatedRecordType, relatedRecordId, status: "queued" });
  } catch (error) {
    const racedRecord = (await db.select().from(notifications).where(and(eq(notifications.type, type), eq(notifications.relatedRecordType, relatedRecordType), eq(notifications.relatedRecordId, relatedRecordId))).limit(1))[0];
    if (racedRecord) return racedRecord;
    throw error;
  }
  const created = (await db.select().from(notifications).orderBy(desc(notifications.id)).limit(1))[0];
  const sent = await notifyOwner({ title, content });
  if (created) await db.update(notifications).set({ status: sent ? "sent" : "failed", sentAt: sent ? new Date() : null }).where(eq(notifications.id, created.id));
  return created;
}

export async function prepareMissionControl(user: AuthenticatedUser) {
  await ensurePilotData(user);
  return getContextById(user.id);
}

export async function getDashboard(user: AuthenticatedUser, overrides: ServiceOverrides = {}) {
  const activeContext = await (overrides.prepareMissionControl ?? prepareMissionControl)(user);
  const db = await (overrides.getDb ?? getDb)();
  if (!db) throw new Error("Mission Control database is unavailable.");
  const [components, activeExperiments, openRisks, pendingGates, scopedMissions, recentEvaluations, recentAudit] = await Promise.all([
    db.select().from(stackComponents).orderBy(desc(stackComponents.readinessScore)),
    db.select().from(experiments).where(inArray(experiments.status, ["planned", "active", "paused"])).orderBy(desc(experiments.updatedAt)),
    db.select().from(risks).where(inArray(risks.status, ["open", "monitoring"])).orderBy(desc(risks.createdAt)),
    db.select().from(decisionGates).where(eq(decisionGates.status, "pending")).orderBy(decisionGates.dueAt),
    db.select().from(missions).where(and(eq(missions.organizationId, activeContext.organizationId), eq(missions.legalEntityId, activeContext.legalEntityId), eq(missions.stakeholderGroupId, activeContext.stakeholderGroupId))).orderBy(desc(missions.updatedAt)),
    db.select().from(evaluations).orderBy(desc(evaluations.createdAt)).limit(6),
    db.select().from(auditEvents).orderBy(desc(auditEvents.createdAt)).limit(8),
  ]);
  const summary = composeDashboardSummary(components.map(component => component.readinessScore), pendingGates);
  return { activeContext, readiness: summary.readiness, components, activeExperiments, openRisks, pendingGates, missions: scopedMissions, recentEvaluations, recentAudit, founderAction: summary.founderAction, pilotMode: PILOT_MODE };
}

export async function listContexts(user: AuthenticatedUser) {
  await ensurePilotData(user);
  const db = await getDb();
  if (!db) throw new Error("Mission Control database is unavailable.");
  const contexts = await db
    .select({
      id: userContexts.id,
      organizationId: organizations.id,
      organizationName: organizations.name,
      legalEntityId: legalEntities.id,
      legalEntityName: legalEntities.name,
      stakeholderGroupId: stakeholderGroups.id,
      stakeholderGroupName: stakeholderGroups.name,
      humanRole: userContexts.humanRole,
      accessLevel: userContexts.accessLevel,
      isDefault: userContexts.isDefault,
    })
    .from(userContexts)
    .innerJoin(organizations, eq(userContexts.organizationId, organizations.id))
    .innerJoin(legalEntities, eq(userContexts.legalEntityId, legalEntities.id))
    .innerJoin(stakeholderGroups, eq(userContexts.stakeholderGroupId, stakeholderGroups.id))
    .where(eq(userContexts.userId, user.id));
  return contexts.map(context => ({ ...context, label: contextLabel(context) }));
}

export async function setDefaultContext(user: AuthenticatedUser, context: ActiveContextInput, overrides: ServiceOverrides = {}) {
  await (overrides.ensurePilotData ?? ensurePilotData)(user);
  const db = await (overrides.getDb ?? getDb)();
  if (!db) throw new Error("Mission Control database is unavailable.");
  const match = (await db.select().from(userContexts).where(and(eq(userContexts.userId, user.id), eq(userContexts.organizationId, context.organizationId), eq(userContexts.legalEntityId, context.legalEntityId), eq(userContexts.stakeholderGroupId, context.stakeholderGroupId), eq(userContexts.humanRole, context.humanRole))).limit(1))[0];
  if (!match) throw new Error("The selected active context is not authorized for this user.");
  await db.update(userContexts).set({ isDefault: false }).where(eq(userContexts.userId, user.id));
  await db.update(userContexts).set({ isDefault: true }).where(eq(userContexts.id, match.id));
  const result = await (overrides.getContextById ?? getContextById)(user.id, match.id);
  await (overrides.audit ?? audit)(user, result.label, "context.activated", "user_context", match.id, { pilotMode: PILOT_MODE });
  return result;
}

export async function listRequirements(user: AuthenticatedUser) {
  const context = await prepareMissionControl(user);
  const db = await getDb();
  if (!db) throw new Error("Mission Control database is unavailable.");
  const rows = await db.select().from(requirementsRegister).orderBy(requirementsRegister.priority, requirementsRegister.code);
  await audit(user, context.label, "requirements.viewed", "requirements_register", null, { count: rows.length });
  return rows;
}

export async function createRequirement(user: AuthenticatedUser, input: { code: string; category: string; question: string; answer: string; status: "confirmed" | "working_assumption" | "open_decision" | "needs_evidence" | "deferred"; priority: "P0" | "P1" | "P2"; evidencePaths: string[]; architectureDelta?: string }) {
  const context = await prepareMissionControl(user);
  const db = await getDb();
  if (!db) throw new Error("Mission Control database is unavailable.");
  await db.insert(requirementsRegister).values({ ...input, architectureDelta: input.architectureDelta ?? null, sourceStatus: "new_proposal" });
  const created = (await db.select().from(requirementsRegister).where(eq(requirementsRegister.code, input.code)).limit(1))[0]!;
  await audit(user, context.label, "requirement.created", "requirements_register", created.id, { code: created.code, priority: created.priority, pilotMode: PILOT_MODE });
  return created;
}

export async function listMissions(user: AuthenticatedUser) {
  const context = await prepareMissionControl(user);
  const db = await getDb();
  if (!db) throw new Error("Mission Control database is unavailable.");
  const rows = await db.select().from(missions).where(and(eq(missions.organizationId, context.organizationId), eq(missions.legalEntityId, context.legalEntityId), eq(missions.stakeholderGroupId, context.stakeholderGroupId))).orderBy(desc(missions.updatedAt));
  return rows;
}

export async function getMissionDetail(user: AuthenticatedUser, missionId: number) {
  const context = await prepareMissionControl(user);
  const db = await getDb();
  if (!db) throw new Error("Mission Control database is unavailable.");
  const mission = (await db.select().from(missions).where(and(eq(missions.id, missionId), eq(missions.organizationId, context.organizationId), eq(missions.legalEntityId, context.legalEntityId), eq(missions.stakeholderGroupId, context.stakeholderGroupId))).limit(1))[0];
  if (!mission) throw new Error("Mission is not available in the active context.");
  const [work, packs, gates, linkedRisks, files] = await Promise.all([
    db.select().from(workItems).where(eq(workItems.missionId, missionId)).orderBy(desc(workItems.updatedAt)),
    db.select().from(contextPacks).where(eq(contextPacks.missionId, missionId)).orderBy(desc(contextPacks.updatedAt)),
    db.select().from(decisionGates).where(eq(decisionGates.missionId, missionId)).orderBy(desc(decisionGates.updatedAt)),
    db.select().from(risks).where(eq(risks.missionId, missionId)).orderBy(desc(risks.createdAt)),
    db.select().from(fileReferences).where(eq(fileReferences.missionId, missionId)).orderBy(desc(fileReferences.createdAt)),
  ]);
  const workIds = work.map(item => item.id);
  const artifactRows = workIds.length ? await db.select().from(artifacts).where(inArray(artifacts.workItemId, workIds)).orderBy(desc(artifacts.updatedAt)) : [];
  const artifactIds = artifactRows.map(item => item.id);
  const reviewRows = artifactIds.length ? await db.select().from(reviews).where(inArray(reviews.artifactId, artifactIds)).orderBy(desc(reviews.createdAt)) : [];
  const packIds = packs.map(pack => pack.id);
  const sourceRows = packIds.length ? await db.select().from(contextPackSources).where(inArray(contextPackSources.contextPackId, packIds)).orderBy(contextPackSources.repositoryPath) : [];
  return { activeContext: context, mission, workItems: work, contextPacks: packs, contextPackSources: sourceRows, artifacts: artifactRows, reviews: reviewRows, gates, risks: linkedRisks, files };
}

export async function createContextPack(user: AuthenticatedUser, input: { missionId: number; title: string; sourcePaths: string[]; proposalSummary?: string }) {
  const context = await prepareMissionControl(user);
  const db = await getDb();
  if (!db) throw new Error("Mission Control database is unavailable.");
  const mission = (await db.select().from(missions).where(and(eq(missions.id, input.missionId), eq(missions.organizationId, context.organizationId))).limit(1))[0];
  if (!mission || mission.pilotMode !== PILOT_MODE) throw new Error("Context packs are permitted only for a scoped synthetic mission.");
  if (input.sourcePaths.some(path => !isApprovedSourcePath(path))) throw new Error("Context pack contains a source path outside the approved Human Blockchain allowlist.");
  await db.insert(contextPacks).values({ missionId: mission.id, title: input.title, proposalSummary: input.proposalSummary ?? null, sourceStatus: "authoritative_source", status: "draft", assembledBy: user.name || "Authenticated internal user" });
  const pack = (await db.select().from(contextPacks).orderBy(desc(contextPacks.id)).limit(1))[0]!;
  await db.insert(contextPackSources).values(input.sourcePaths.map(repositoryPath => {
    const entry = catalogEntry(repositoryPath);
    return { contextPackId: pack.id, repositoryPath, sourceTitle: entry.title, sourceStatus: entry.status, excerpt: entry.excerpt, contentHash: entry.hash };
  }));
  await audit(user, context.label, "context_pack.assembled", "context_pack", pack.id, { missionId: mission.id, sourcePaths: input.sourcePaths, proposalPresent: Boolean(input.proposalSummary), pilotMode: PILOT_MODE });
  return pack;
}

export async function generateArtifactDraft(user: AuthenticatedUser, input: { workItemId: number; contextPackId: number; title: string; requestedOutcome: string }) {
  const context = await prepareMissionControl(user);
  const db = await getDb();
  if (!db) throw new Error("Mission Control database is unavailable.");
  const workItem = (await db.select().from(workItems).where(eq(workItems.id, input.workItemId)).limit(1))[0];
  const pack = (await db.select().from(contextPacks).where(eq(contextPacks.id, input.contextPackId)).limit(1))[0];
  if (!workItem || !pack || pack.missionId !== workItem.missionId || !workItem.syntheticOnly) throw new Error("Artifact generation requires a synthetic work item and its matching context pack.");
  const sources = await db.select().from(contextPackSources).where(eq(contextPackSources.contextPackId, pack.id));
  if (!sources.length || sources.some(source => !isApprovedSourcePath(source.repositoryPath))) throw new Error("Artifact generation requires at least one approved context-pack source.");
  const sourceText = sources.map((source, index) => `[S${index + 1}] ${source.repositoryPath}\nStatus: ${source.sourceStatus}\nExcerpt: ${source.excerpt}`).join("\n\n");
  let generatedContent = "";
  try {
    const catalog = await listLLMModels();
    const model = catalog.data.find(item => item.id.startsWith("gpt-5-mini"))?.id ?? catalog.data[0]?.id;
    const response = await invokeLLM({
      model,
      messages: [
        { role: "system", content: "You are a bounded internal Mission Control drafting service. Produce a concise structured markdown draft. Use only the provided sources. Clearly separate Source-grounded observations, assumptions, and New proposal. Cite every source-grounded point using [S1], [S2], etc. Do not advise or execute financial, regulated, external communication, production access, or live actions. The artifact remains a synthetic-only draft requiring independent review and human approval." },
        { role: "user", content: `Work item: ${workItem.title}\nArtifact contract: ${workItem.artifactContract}\nRequested outcome: ${input.requestedOutcome}\n\nApproved context pack:\n${sourceText}` },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "mission_control_draft",
          strict: true,
          schema: {
            type: "object",
            properties: {
              source_grounded_observations: { type: "array", items: { type: "string" } },
              assumptions: { type: "array", items: { type: "string" } },
              new_proposal: { type: "string" },
              required_evidence: { type: "array", items: { type: "string" } },
              non_actions: { type: "array", items: { type: "string" } },
              citations_used: { type: "array", items: { type: "string" } },
            },
            required: ["source_grounded_observations", "assumptions", "new_proposal", "required_evidence", "non_actions", "citations_used"],
            additionalProperties: false,
          },
        },
      },
    });
    const responseContent = response.choices[0]?.message?.content;
    if (typeof responseContent !== "string") throw new Error("Drafting response did not contain structured text content.");
    const parsed = JSON.parse(responseContent);
    generatedContent = `## Source-grounded observations\n${parsed.source_grounded_observations.map((item: string) => `- ${item}`).join("\n")}\n\n## Assumptions\n${parsed.assumptions.map((item: string) => `- ${item}`).join("\n")}\n\n## New proposal\n${parsed.new_proposal}\n\n## Required evidence\n${parsed.required_evidence.map((item: string) => `- ${item}`).join("\n")}\n\n## Non-actions\n${parsed.non_actions.map((item: string) => `- ${item}`).join("\n")}\n\n## Context-pack citations\n${parsed.citations_used.map((item: string) => `- ${item}`).join("\n")}`;
  } catch (error) {
    generatedContent = `## Draft generation paused\n\nThe structured drafting service was unavailable. This record remains a synthetic-only draft shell with no state promotion.\n\n**Requested outcome:** ${input.requestedOutcome}\n\n**Approved sources:**\n${sources.map(source => `- ${source.repositoryPath} (${source.sourceStatus})`).join("\n")}\n\n**Required next action:** an authorized reviewer may retry generation or add a reviewed manual draft.`;
  }
  await db.insert(artifacts).values({ workItemId: workItem.id, contextPackId: pack.id, title: input.title, artifactType: "structured_draft", content: generatedContent, sourceStatus: "new_proposal", status: "under_review", generatedBy: "Mission Control Draft Service", syntheticOnly: true });
  const artifact = (await db.select().from(artifacts).orderBy(desc(artifacts.id)).limit(1))[0]!;
  await db.insert(artifactCitations).values(sources.map(source => ({ artifactId: artifact.id, contextPackSourceId: source.id, claimLabel: "proposal" as const, citationNote: `Approved context-pack path: ${source.repositoryPath}` })));
  await db.update(workItems).set({ status: "awaiting_review" }).where(eq(workItems.id, workItem.id));
  await audit(user, context.label, "artifact.draft_generated", "artifact", artifact.id, { workItemId: workItem.id, contextPackId: pack.id, pilotMode: PILOT_MODE, sourcePaths: sources.map(source => source.repositoryPath) });
  return artifact;
}

export async function createArtifactReview(user: AuthenticatedUser, input: { artifactId: number; verdict: "pass" | "revision_needed" | "blocked"; findings: string }) {
  const context = await prepareMissionControl(user);
  const db = await getDb();
  if (!db) throw new Error("Mission Control database is unavailable.");
  const artifact = (await db.select().from(artifacts).where(eq(artifacts.id, input.artifactId)).limit(1))[0];
  if (!artifact || !artifact.syntheticOnly) throw new Error("Only synthetic-only artifacts may be reviewed in this pilot.");
  await db.insert(reviews).values({ artifactId: artifact.id, reviewerTeam: "Quality & Risk Review Team", verdict: input.verdict, findings: input.findings, isIndependent: true });
  await db.update(artifacts).set({ status: input.verdict === "pass" ? "approved" : input.verdict === "blocked" ? "rejected" : "under_review" }).where(eq(artifacts.id, artifact.id));
  await db.update(workItems).set({ status: input.verdict === "pass" ? "complete" : input.verdict === "blocked" ? "blocked" : "awaiting_review" }).where(eq(workItems.id, artifact.workItemId));
  await audit(user, context.label, "artifact.reviewed", "artifact", artifact.id, { verdict: input.verdict, independent: true, pilotMode: PILOT_MODE });
  return { artifactId: artifact.id, verdict: input.verdict };
}

export async function decideGate(user: AuthenticatedUser, input: { gateId: number; decision: "approved" | "rejected" | "deferred" | "revision_requested"; rationale: string }, overrides: ServiceOverrides = {}) {
  const context = await (overrides.prepareMissionControl ?? prepareMissionControl)(user);
  if (!isDesignatedDecisionOwner(user.role, context.accessLevel)) throw new Error("Only a designated decision owner may resolve a Mission Control gate.");
  const db = await (overrides.getDb ?? getDb)();
  if (!db) throw new Error("Mission Control database is unavailable.");
  const gate = (await db.select().from(decisionGates).where(eq(decisionGates.id, input.gateId)).limit(1))[0];
  if (!gate || gate.status !== "pending" || !gate.syntheticOnly) throw new Error("Only pending synthetic-only decision gates can be resolved.");
  await db.insert(decisions).values({ gateId: gate.id, decision: input.decision, rationale: input.rationale, decidedByUserId: user.id, activeContextLabel: context.label });
  await db.update(decisionGates).set({ status: input.decision }).where(eq(decisionGates.id, gate.id));
  if (gate.workItemId) await db.update(workItems).set({ status: input.decision === "approved" ? "complete" : input.decision === "rejected" ? "blocked" : "awaiting_review" }).where(eq(workItems.id, gate.workItemId));
  await (overrides.audit ?? audit)(user, context.label, "decision_gate.resolved", "decision_gate", gate.id, { decision: input.decision, pilotMode: PILOT_MODE, humanGate: true });
  return { gateId: gate.id, status: input.decision };
}

export async function uploadFileReference(user: AuthenticatedUser, input: { missionId?: number; fileName: string; mimeType: string; sourceType: "source_document" | "evidence_file" | "generated_artifact"; sourceStatus: "authoritative_source" | "working_model" | "historical_context" | "new_proposal"; sensitivity: "internal" | "restricted" | "synthetic_demo"; notes?: string; contentBase64: string }) {
  const context = await prepareMissionControl(user);
  assertSyntheticFileSensitivity(input.sensitivity);
  const bytes = Buffer.from(input.contentBase64, "base64");
  if (!bytes.length || bytes.length > 5_000_000) throw new Error("Upload must be a non-empty synthetic file smaller than 5 MB.");
  const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `mission-control/synthetic/${user.id}/${Date.now()}-${safeName}`;
  const stored = await storagePut(key, bytes, input.mimeType);
  const db = await getDb();
  if (!db) throw new Error("Mission Control database is unavailable.");
  await db.insert(fileReferences).values({ missionId: input.missionId ?? null, fileName: input.fileName, storageKey: stored.key, storageUrl: stored.url, mimeType: input.mimeType, sourceType: input.sourceType, sourceStatus: input.sourceStatus, sensitivity: input.sensitivity, notes: input.notes ?? null, uploadedByUserId: user.id });
  const reference = (await db.select().from(fileReferences).orderBy(desc(fileReferences.id)).limit(1))[0]!;
  await audit(user, context.label, "file_reference.created", "file_reference", reference.id, { missionId: input.missionId ?? null, sourceType: input.sourceType, sensitivity: input.sensitivity, storageKey: stored.key, pilotMode: PILOT_MODE });
  return reference;
}

export async function listFiles(user: AuthenticatedUser, missionId?: number) {
  await prepareMissionControl(user);
  const db = await getDb();
  if (!db) throw new Error("Mission Control database is unavailable.");
  return missionId
    ? db.select().from(fileReferences).where(eq(fileReferences.missionId, missionId)).orderBy(desc(fileReferences.createdAt))
    : db.select().from(fileReferences).orderBy(desc(fileReferences.createdAt)).limit(50);
}

export async function listAudit(user: AuthenticatedUser) {
  await prepareMissionControl(user);
  const db = await getDb();
  if (!db) throw new Error("Mission Control database is unavailable.");
  return db.select().from(auditEvents).orderBy(desc(auditEvents.createdAt)).limit(100);
}

export async function listEvaluations(user: AuthenticatedUser) {
  await prepareMissionControl(user);
  const db = await getDb();
  if (!db) throw new Error("Mission Control database is unavailable.");
  return db.select().from(evaluations).orderBy(desc(evaluations.createdAt)).limit(100);
}

export async function listNotifications(user: AuthenticatedUser) {
  await prepareMissionControl(user);
  const db = await getDb();
  if (!db) throw new Error("Mission Control database is unavailable.");
  return db.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(100);
}

export async function runSafetyScan(user: AuthenticatedUser, overrides: ServiceOverrides = {}) {
  const context = await (overrides.prepareMissionControl ?? prepareMissionControl)(user);
  const db = await (overrides.getDb ?? getDb)();
  if (!db) throw new Error("Mission Control database is unavailable.");
  const [pending, incompleteWork, failed, reviewableArtifacts] = await Promise.all([
    db.select().from(decisionGates).where(eq(decisionGates.status, "pending")),
    db.select().from(workItems).where(inArray(workItems.status, ["queued", "in_progress", "blocked"])),
    db.select().from(evaluations).where(eq(evaluations.status, "failed")),
    db.select().from(artifacts).where(inArray(artifacts.status, ["under_review", "approved"])),
  ]);
  const queued: string[] = [];
  for (const gate of pending) {
    const notificationsToQueue = getSafetyScanNotificationTypes({ pendingGate: true, slaRisk: isDecisionGateSlaRisk(gate.dueAt) });
    const alreadyQueued = (await db.select().from(notifications).where(and(eq(notifications.type, "decision_gate"), eq(notifications.relatedRecordId, gate.id))).limit(1))[0];
    if (notificationsToQueue.includes("decision_gate") && !alreadyQueued) {
      await (overrides.queueNotification ?? queueNotification)("decision_gate", `Decision gate: ${gate.title}`, gate.decisionQuestion, gate.owner, "decision_gate", gate.id);
      queued.push(`Decision gate ${gate.id}`);
    }
    if (notificationsToQueue.includes("sla_risk")) {
      await (overrides.queueNotification ?? queueNotification)("sla_risk", `SLA risk: ${gate.title}`, `The pending synthetic decision gate is ${relativeGateDeadline(gate.dueAt!)}. A designated human decision owner should review the packet.`, gate.owner, "decision_gate_sla", gate.id);
      queued.push(`SLA risk for gate ${gate.id}`);
    }
  }
  for (const item of incompleteWork) {
    const artifact = (await db.select().from(artifacts).where(eq(artifacts.workItemId, item.id)).limit(1))[0];
    if (getSafetyScanNotificationTypes({ missingEvidence: !artifact }).includes("missing_evidence")) {
      await (overrides.queueNotification ?? queueNotification)("missing_evidence", `Missing evidence: ${item.title}`, "A synthetic work item requires its contracted artifact or evidence reference before it can advance.", item.assignedTeam, "work_item", item.id);
      queued.push(`Missing evidence for work item ${item.id}`);
    }
  }
  for (const evaluation of failed) {
    if (getSafetyScanNotificationTypes({ failedEvaluation: true }).includes("failed_evaluation")) {
      await (overrides.queueNotification ?? queueNotification)("failed_evaluation", `Failed evaluation: ${evaluation.name}`, evaluation.findings, "Quality & Risk Review Team", "evaluation", evaluation.id);
      queued.push(`Failed evaluation ${evaluation.id}`);
    }
  }
  for (const artifact of reviewableArtifacts) {
    const review = (await db.select().from(reviews).where(eq(reviews.artifactId, artifact.id)).limit(1))[0];
    if (getSafetyScanNotificationTypes({ manualReviewException: requiresManualReviewException(artifact.status, Boolean(review?.isIndependent)) }).includes("manual_review_exception")) {
      await (overrides.queueNotification ?? queueNotification)("manual_review_exception", `Manual review required: ${artifact.title}`, "A synthetic artifact reached a reviewable state without an independent review record. No consequential promotion is permitted.", "Quality & Risk Review Team", "artifact_review", artifact.id);
      queued.push(`Manual-review exception for artifact ${artifact.id}`);
    }
  }
  await (overrides.audit ?? audit)(user, context.label, "safety_scan.completed", "mission_control", null, { queued, pilotMode: PILOT_MODE });
  return { queued, checked: { pendingGates: pending.length, incompleteWork: incompleteWork.length, failedEvaluations: failed.length, reviewableArtifacts: reviewableArtifacts.length } };
}

function relativeGateDeadline(dueAt: Date) {
  const milliseconds = dueAt.getTime() - Date.now();
  const hours = Math.max(1, Math.round(Math.abs(milliseconds) / 36e5));
  return milliseconds >= 0 ? `due in ${hours} hour${hours === 1 ? "" : "s"}` : `${hours} hour${hours === 1 ? "" : "s"} overdue`;
}
