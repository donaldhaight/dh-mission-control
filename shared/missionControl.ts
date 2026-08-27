import { z } from "zod";

export const PILOT_MODE = "synthetic_only" as const;

export const APPROVED_CONTEXT_PATHS = [
  "README.md",
  "AGENTS.md",
  "docs/00-start-here/master-continuity-brief.md",
] as const;

export const APPROVED_CONTEXT_PREFIXES = [
  "docs/00-start-here/",
  "docs/01-governance/",
  "docs/02-architecture/",
  "docs/03-operations/",
  "docs/04-platform/",
] as const;

export const sourceStatusSchema = z.enum([
  "authoritative_source",
  "working_model",
  "historical_context",
  "new_proposal",
]);

export const prioritySchema = z.enum(["P0", "P1", "P2"]);
export const requirementStatusSchema = z.enum([
  "confirmed",
  "working_assumption",
  "open_decision",
  "needs_evidence",
  "deferred",
]);
export const missionStatusSchema = z.enum([
  "intake",
  "active",
  "review",
  "blocked",
  "complete",
]);
export const workItemStatusSchema = z.enum([
  "queued",
  "in_progress",
  "awaiting_review",
  "blocked",
  "complete",
]);
export const gateStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
  "deferred",
  "revision_requested",
]);
export const riskStatusSchema = z.enum(["open", "monitoring", "mitigated", "accepted"]);
export const severitySchema = z.enum(["low", "moderate", "high", "critical"]);
export const artifactStatusSchema = z.enum(["draft", "under_review", "approved", "rejected"]);
export const reviewVerdictSchema = z.enum(["pass", "revision_needed", "blocked"]);
export const notificationTypeSchema = z.enum([
  "decision_gate",
  "failed_evaluation",
  "missing_evidence",
  "sla_risk",
  "manual_review_exception",
]);

export const consequentialActionSchema = z.enum([
  "financial",
  "regulated",
  "external_communication",
  "production_access",
]);

export const sourcePathSchema = z
  .string()
  .min(3)
  .max(512)
  .refine(
    path =>
      APPROVED_CONTEXT_PATHS.includes(path as (typeof APPROVED_CONTEXT_PATHS)[number]) ||
      APPROVED_CONTEXT_PREFIXES.some(prefix => path.startsWith(prefix)),
    "Only approved Human Blockchain repository paths may be added to a context pack."
  );

export function isApprovedSourcePath(path: string) {
  return sourcePathSchema.safeParse(path).success;
}

export function getReadinessScore(scores: number[]) {
  if (!scores.length) return 0;
  return Math.round(scores.reduce((total, score) => total + score, 0) / scores.length);
}

export function assertSyntheticPilotAllows(action: z.infer<typeof consequentialActionSchema>): never {
  throw new Error(`Synthetic-only pilot mode blocks ${action.replace(/_/g, " ")} actions. A named human must authorize any future non-pilot workflow outside this control plane.`);
}

export function assertSyntheticFileSensitivity(sensitivity: z.infer<typeof fileProvenanceInputSchema>["sensitivity"]) {
  if (sensitivity !== "synthetic_demo") {
    throw new Error("This pilot accepts only synthetic-demo file references. Restricted or live material is not permitted.");
  }
}

export function isDecisionGateSlaRisk(dueAt: Date | null | undefined, now = Date.now()) {
  return Boolean(dueAt && dueAt.getTime() - now <= 1000 * 60 * 60 * 48);
}

export function requiresManualReviewException(status: string, hasIndependentReview: boolean) {
  return (status === "under_review" || status === "approved") && !hasIndependentReview;
}

export function isDesignatedDecisionOwner(userRole: string, accessLevel: string) {
  return userRole === "admin" || accessLevel === "admin" || accessLevel === "decision_owner";
}

export type PendingGateSummary = {
  id: number;
  title: string;
  decisionQuestion: string;
  owner: string;
};

export function composeDashboardSummary(readinessScores: number[], pendingGates: PendingGateSummary[]) {
  const firstGate = pendingGates[0];
  return {
    readiness: getReadinessScore(readinessScores),
    founderAction: firstGate
      ? { title: firstGate.title, detail: firstGate.decisionQuestion, gateId: firstGate.id, owner: firstGate.owner }
      : { title: "No pending founder gate", detail: "Continue reviewing stack readiness and open risks.", gateId: null, owner: "Founder" },
  };
}

export function getSafetyScanNotificationTypes(input: { pendingGate?: boolean; slaRisk?: boolean; missingEvidence?: boolean; failedEvaluation?: boolean; manualReviewException?: boolean }) {
  const types: z.infer<typeof notificationTypeSchema>[] = [];
  if (input.pendingGate) types.push("decision_gate");
  if (input.slaRisk) types.push("sla_risk");
  if (input.missingEvidence) types.push("missing_evidence");
  if (input.failedEvaluation) types.push("failed_evaluation");
  if (input.manualReviewException) types.push("manual_review_exception");
  return types;
}

export const activeContextInputSchema = z.object({
  organizationId: z.number().int().positive(),
  legalEntityId: z.number().int().positive(),
  stakeholderGroupId: z.number().int().positive(),
  humanRole: z.string().trim().min(2).max(120),
});

export const requirementInputSchema = z.object({
  code: z.string().trim().min(3).max(64),
  category: z.string().trim().min(2).max(120),
  question: z.string().trim().min(5).max(2000),
  answer: z.string().trim().min(2).max(5000),
  status: requirementStatusSchema,
  priority: prioritySchema,
  evidencePaths: z.array(sourcePathSchema).max(12),
  architectureDelta: z.string().trim().max(2000).optional(),
});

export const decisionInputSchema = z.object({
  gateId: z.number().int().positive(),
  decision: z.enum(["approved", "rejected", "deferred", "revision_requested"]),
  rationale: z.string().trim().min(8).max(3000),
});

export const contextPackInputSchema = z.object({
  missionId: z.number().int().positive(),
  title: z.string().trim().min(3).max(200),
  sourcePaths: z.array(sourcePathSchema).min(1).max(12),
  proposalSummary: z.string().trim().max(3000).optional(),
});

export const artifactDraftInputSchema = z.object({
  workItemId: z.number().int().positive(),
  contextPackId: z.number().int().positive(),
  title: z.string().trim().min(3).max(200),
  requestedOutcome: z.string().trim().min(12).max(2000),
});

export const artifactReviewInputSchema = z.object({
  artifactId: z.number().int().positive(),
  verdict: reviewVerdictSchema,
  findings: z.string().trim().min(12).max(5000),
});

export const fileProvenanceInputSchema = z.object({
  missionId: z.number().int().positive().optional(),
  fileName: z.string().trim().min(1).max(240),
  mimeType: z.string().trim().min(3).max(120),
  sourceType: z.enum(["source_document", "evidence_file", "generated_artifact"]),
  sourceStatus: sourceStatusSchema,
  sensitivity: z.enum(["internal", "restricted", "synthetic_demo"]),
  notes: z.string().trim().max(2000).optional(),
});

export type ActiveContextInput = z.infer<typeof activeContextInputSchema>;
