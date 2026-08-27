import {
  boolean,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * The built-in users table is the auth-backed account record. The domain tables
 * below apply application-level context checks in protected procedures and keep
 * all operational data explicitly synthetic in this first pilot.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const organizations = mysqlTable(
  "organizations",
  {
    id: int("id").autoincrement().primaryKey(),
    code: varchar("code", { length: 64 }).notNull(),
    name: varchar("name", { length: 240 }).notNull(),
    status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
    syntheticOnly: boolean("syntheticOnly").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("organizations_code_uq").on(table.code)]
);

export const legalEntities = mysqlTable(
  "legal_entities",
  {
    id: int("id").autoincrement().primaryKey(),
    organizationId: int("organizationId").notNull().references(() => organizations.id),
    code: varchar("code", { length: 64 }).notNull(),
    name: varchar("name", { length: 240 }).notNull(),
    jurisdiction: varchar("jurisdiction", { length: 120 }).notNull(),
    syntheticOnly: boolean("syntheticOnly").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("legal_entities_org_code_uq").on(table.organizationId, table.code),
    index("legal_entities_org_idx").on(table.organizationId),
  ]
);

export const stakeholderGroups = mysqlTable(
  "stakeholder_groups",
  {
    id: int("id").autoincrement().primaryKey(),
    organizationId: int("organizationId").notNull().references(() => organizations.id),
    code: varchar("code", { length: 64 }).notNull(),
    name: varchar("name", { length: 240 }).notNull(),
    description: text("description"),
    syntheticOnly: boolean("syntheticOnly").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("stakeholder_groups_org_code_uq").on(table.organizationId, table.code),
    index("stakeholder_groups_org_idx").on(table.organizationId),
  ]
);

export const userContexts = mysqlTable(
  "user_contexts",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id),
    organizationId: int("organizationId").notNull().references(() => organizations.id),
    legalEntityId: int("legalEntityId").notNull().references(() => legalEntities.id),
    stakeholderGroupId: int("stakeholderGroupId").notNull().references(() => stakeholderGroups.id),
    humanRole: varchar("humanRole", { length: 120 }).notNull(),
    accessLevel: mysqlEnum("accessLevel", ["viewer", "operator", "decision_owner", "admin"])
      .default("viewer")
      .notNull(),
    isDefault: boolean("isDefault").default(false).notNull(),
    syntheticOnly: boolean("syntheticOnly").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    index("user_contexts_user_idx").on(table.userId),
    index("user_contexts_scope_idx").on(table.organizationId, table.legalEntityId, table.stakeholderGroupId),
  ]
);

export const stackComponents = mysqlTable(
  "stack_components",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    layer: varchar("layer", { length: 120 }).notNull(),
    status: mysqlEnum("status", ["not_started", "designing", "testing", "ready", "blocked"])
      .default("not_started")
      .notNull(),
    readinessScore: int("readinessScore").default(0).notNull(),
    owner: varchar("owner", { length: 160 }).notNull(),
    summary: text("summary").notNull(),
    syntheticOnly: boolean("syntheticOnly").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("stack_components_status_idx").on(table.status)]
);

export const experiments = mysqlTable(
  "experiments",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 240 }).notNull(),
    hypothesis: text("hypothesis").notNull(),
    status: mysqlEnum("status", ["planned", "active", "paused", "complete"]).default("planned").notNull(),
    owner: varchar("owner", { length: 160 }).notNull(),
    successMetric: text("successMetric").notNull(),
    pilotMode: mysqlEnum("pilotMode", ["synthetic_only"]).default("synthetic_only").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("experiments_status_idx").on(table.status)]
);

export const requirementsRegister = mysqlTable(
  "requirements_register",
  {
    id: int("id").autoincrement().primaryKey(),
    code: varchar("code", { length: 64 }).notNull(),
    category: varchar("category", { length: 120 }).notNull(),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    status: mysqlEnum("status", ["confirmed", "working_assumption", "open_decision", "needs_evidence", "deferred"])
      .notNull(),
    priority: mysqlEnum("priority", ["P0", "P1", "P2"]).notNull(),
    evidencePaths: json("evidencePaths").$type<string[]>().notNull(),
    architectureDelta: text("architectureDelta"),
    sourceStatus: mysqlEnum("sourceStatus", ["authoritative_source", "working_model", "historical_context", "new_proposal"])
      .default("working_model")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("requirements_register_code_uq").on(table.code), index("requirements_priority_idx").on(table.priority, table.status)]
);

export const missions = mysqlTable(
  "missions",
  {
    id: int("id").autoincrement().primaryKey(),
    organizationId: int("organizationId").notNull().references(() => organizations.id),
    legalEntityId: int("legalEntityId").notNull().references(() => legalEntities.id),
    stakeholderGroupId: int("stakeholderGroupId").notNull().references(() => stakeholderGroups.id),
    title: varchar("title", { length: 240 }).notNull(),
    objective: text("objective").notNull(),
    successMeasure: text("successMeasure").notNull(),
    owner: varchar("owner", { length: 160 }).notNull(),
    nextFounderAction: text("nextFounderAction").notNull(),
    status: mysqlEnum("status", ["intake", "active", "review", "blocked", "complete"]).default("intake").notNull(),
    pilotMode: mysqlEnum("pilotMode", ["synthetic_only"]).default("synthetic_only").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("missions_scope_idx").on(table.organizationId, table.legalEntityId, table.stakeholderGroupId), index("missions_status_idx").on(table.status)]
);

export const contextPacks = mysqlTable(
  "context_packs",
  {
    id: int("id").autoincrement().primaryKey(),
    missionId: int("missionId").notNull().references(() => missions.id),
    title: varchar("title", { length: 200 }).notNull(),
    proposalSummary: text("proposalSummary"),
    sourceStatus: mysqlEnum("sourceStatus", ["authoritative_source", "working_model", "historical_context", "new_proposal"])
      .default("authoritative_source")
      .notNull(),
    status: mysqlEnum("status", ["draft", "approved", "superseded"]).default("draft").notNull(),
    assembledBy: varchar("assembledBy", { length: 160 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("context_packs_mission_idx").on(table.missionId, table.status)]
);

export const contextPackSources = mysqlTable(
  "context_pack_sources",
  {
    id: int("id").autoincrement().primaryKey(),
    contextPackId: int("contextPackId").notNull().references(() => contextPacks.id),
    repositoryPath: varchar("repositoryPath", { length: 512 }).notNull(),
    sourceTitle: varchar("sourceTitle", { length: 240 }).notNull(),
    sourceStatus: mysqlEnum("sourceStatus", ["authoritative_source", "working_model", "historical_context"])
      .default("authoritative_source")
      .notNull(),
    excerpt: text("excerpt").notNull(),
    contentHash: varchar("contentHash", { length: 128 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [uniqueIndex("context_pack_sources_path_uq").on(table.contextPackId, table.repositoryPath), index("context_pack_sources_pack_idx").on(table.contextPackId)]
);

export const workItems = mysqlTable(
  "work_items",
  {
    id: int("id").autoincrement().primaryKey(),
    missionId: int("missionId").notNull().references(() => missions.id),
    title: varchar("title", { length: 240 }).notNull(),
    assignedTeam: varchar("assignedTeam", { length: 160 }).notNull(),
    objective: text("objective").notNull(),
    artifactContract: text("artifactContract").notNull(),
    acceptanceCriteria: text("acceptanceCriteria").notNull(),
    status: mysqlEnum("status", ["queued", "in_progress", "awaiting_review", "blocked", "complete"])
      .default("queued")
      .notNull(),
    requiresIndependentReview: boolean("requiresIndependentReview").default(true).notNull(),
    syntheticOnly: boolean("syntheticOnly").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("work_items_mission_idx").on(table.missionId, table.status)]
);

export const artifacts = mysqlTable(
  "artifacts",
  {
    id: int("id").autoincrement().primaryKey(),
    workItemId: int("workItemId").notNull().references(() => workItems.id),
    contextPackId: int("contextPackId").notNull().references(() => contextPacks.id),
    title: varchar("title", { length: 240 }).notNull(),
    artifactType: varchar("artifactType", { length: 120 }).notNull(),
    content: text("content").notNull(),
    sourceStatus: mysqlEnum("sourceStatus", ["authoritative_source", "working_model", "historical_context", "new_proposal"])
      .default("new_proposal")
      .notNull(),
    status: mysqlEnum("status", ["draft", "under_review", "approved", "rejected"]).default("draft").notNull(),
    generatedBy: varchar("generatedBy", { length: 160 }).notNull(),
    syntheticOnly: boolean("syntheticOnly").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("artifacts_work_item_idx").on(table.workItemId, table.status), index("artifacts_context_pack_idx").on(table.contextPackId)]
);

export const artifactCitations = mysqlTable(
  "artifact_citations",
  {
    id: int("id").autoincrement().primaryKey(),
    artifactId: int("artifactId").notNull().references(() => artifacts.id),
    contextPackSourceId: int("contextPackSourceId").notNull().references(() => contextPackSources.id),
    claimLabel: mysqlEnum("claimLabel", ["observed", "reported", "inference", "assumption", "proposal"])
      .default("proposal")
      .notNull(),
    citationNote: text("citationNote").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("artifact_citations_artifact_idx").on(table.artifactId)]
);

export const reviews = mysqlTable(
  "reviews",
  {
    id: int("id").autoincrement().primaryKey(),
    artifactId: int("artifactId").notNull().references(() => artifacts.id),
    reviewerTeam: varchar("reviewerTeam", { length: 160 }).notNull(),
    verdict: mysqlEnum("verdict", ["pass", "revision_needed", "blocked"]).notNull(),
    findings: text("findings").notNull(),
    isIndependent: boolean("isIndependent").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("reviews_artifact_idx").on(table.artifactId, table.verdict)]
);

export const decisionGates = mysqlTable(
  "decision_gates",
  {
    id: int("id").autoincrement().primaryKey(),
    missionId: int("missionId").notNull().references(() => missions.id),
    workItemId: int("workItemId").references(() => workItems.id),
    title: varchar("title", { length: 240 }).notNull(),
    decisionQuestion: text("decisionQuestion").notNull(),
    owner: varchar("owner", { length: 160 }).notNull(),
    status: mysqlEnum("status", ["pending", "approved", "rejected", "deferred", "revision_requested"])
      .default("pending")
      .notNull(),
    dueAt: timestamp("dueAt"),
    syntheticOnly: boolean("syntheticOnly").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("decision_gates_mission_idx").on(table.missionId, table.status), index("decision_gates_status_idx").on(table.status, table.dueAt)]
);

export const decisions = mysqlTable(
  "decisions",
  {
    id: int("id").autoincrement().primaryKey(),
    gateId: int("gateId").notNull().references(() => decisionGates.id),
    decision: mysqlEnum("decision", ["approved", "rejected", "deferred", "revision_requested"]).notNull(),
    rationale: text("rationale").notNull(),
    decidedByUserId: int("decidedByUserId").notNull().references(() => users.id),
    activeContextLabel: varchar("activeContextLabel", { length: 500 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("decisions_gate_idx").on(table.gateId)]
);

export const risks = mysqlTable(
  "risks",
  {
    id: int("id").autoincrement().primaryKey(),
    missionId: int("missionId").references(() => missions.id),
    title: varchar("title", { length: 240 }).notNull(),
    description: text("description").notNull(),
    severity: mysqlEnum("severity", ["low", "moderate", "high", "critical"]).notNull(),
    status: mysqlEnum("status", ["open", "monitoring", "mitigated", "accepted"]).default("open").notNull(),
    owner: varchar("owner", { length: 160 }).notNull(),
    mitigation: text("mitigation").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("risks_status_severity_idx").on(table.status, table.severity), index("risks_mission_idx").on(table.missionId)]
);

export const evaluations = mysqlTable(
  "evaluations",
  {
    id: int("id").autoincrement().primaryKey(),
    missionId: int("missionId").references(() => missions.id),
    artifactId: int("artifactId").references(() => artifacts.id),
    name: varchar("name", { length: 240 }).notNull(),
    status: mysqlEnum("status", ["pending", "passed", "failed"]).default("pending").notNull(),
    score: int("score"),
    criteria: text("criteria").notNull(),
    findings: text("findings").notNull(),
    improvementCandidate: text("improvementCandidate"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("evaluations_status_idx").on(table.status), index("evaluations_mission_idx").on(table.missionId)]
);

export const fileReferences = mysqlTable(
  "file_references",
  {
    id: int("id").autoincrement().primaryKey(),
    missionId: int("missionId").references(() => missions.id),
    fileName: varchar("fileName", { length: 240 }).notNull(),
    storageKey: varchar("storageKey", { length: 512 }).notNull(),
    storageUrl: varchar("storageUrl", { length: 1024 }).notNull(),
    mimeType: varchar("mimeType", { length: 120 }).notNull(),
    sourceType: mysqlEnum("sourceType", ["source_document", "evidence_file", "generated_artifact"]).notNull(),
    sourceStatus: mysqlEnum("sourceStatus", ["authoritative_source", "working_model", "historical_context", "new_proposal"])
      .notNull(),
    sensitivity: mysqlEnum("sensitivity", ["internal", "restricted", "synthetic_demo"]).notNull(),
    notes: text("notes"),
    uploadedByUserId: int("uploadedByUserId").notNull().references(() => users.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("file_references_mission_idx").on(table.missionId), uniqueIndex("file_references_storage_key_uq").on(table.storageKey)]
);

export const notifications = mysqlTable(
  "notifications",
  {
    id: int("id").autoincrement().primaryKey(),
    type: mysqlEnum("type", ["decision_gate", "failed_evaluation", "missing_evidence", "sla_risk", "manual_review_exception"])
      .notNull(),
    title: varchar("title", { length: 240 }).notNull(),
    content: text("content").notNull(),
    owner: varchar("owner", { length: 160 }).notNull(),
    status: mysqlEnum("status", ["queued", "sent", "failed", "acknowledged"]).default("queued").notNull(),
    relatedRecordType: varchar("relatedRecordType", { length: 100 }).notNull(),
    relatedRecordId: int("relatedRecordId").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    sentAt: timestamp("sentAt"),
  },
  table => [
    index("notifications_status_idx").on(table.status, table.createdAt),
    uniqueIndex("notifications_trigger_uq").on(table.type, table.relatedRecordType, table.relatedRecordId),
  ]
);

export const auditEvents = mysqlTable(
  "audit_events",
  {
    id: int("id").autoincrement().primaryKey(),
    actorUserId: int("actorUserId").references(() => users.id),
    eventType: varchar("eventType", { length: 160 }).notNull(),
    entityType: varchar("entityType", { length: 120 }).notNull(),
    entityId: int("entityId"),
    correlationId: varchar("correlationId", { length: 100 }).notNull(),
    activeContextLabel: varchar("activeContextLabel", { length: 500 }).notNull(),
    details: json("details").$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("audit_events_correlation_idx").on(table.correlationId), index("audit_events_entity_idx").on(table.entityType, table.entityId)]
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
