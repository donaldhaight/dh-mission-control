import { describe, expect, it } from "vitest";
import {
  activeContextInputSchema,
  assertSyntheticFileSensitivity,
  assertSyntheticPilotAllows,
  decisionInputSchema,
  composeDashboardSummary,
  getReadinessScore,
  getSafetyScanNotificationTypes,
  isDecisionGateSlaRisk,
  isDesignatedDecisionOwner,
  isApprovedSourcePath,
  notificationTypeSchema,
  requirementInputSchema,
  requiresManualReviewException,
} from "../shared/missionControl";

describe("Mission Control policy contracts", () => {
  it("accepts only reviewed Human Blockchain paths in a context pack", () => {
    expect(isApprovedSourcePath("AGENTS.md")).toBe(true);
    expect(isApprovedSourcePath("docs/00-start-here/master-continuity-brief.md")).toBe(true);
    expect(isApprovedSourcePath("docs/02-architecture/authority.md")).toBe(true);
    expect(isApprovedSourcePath(".env")).toBe(false);
    expect(isApprovedSourcePath("private/financial-projection.xlsx")).toBe(false);
  });

  it("requires every active authorization scope before a protected action", () => {
    expect(activeContextInputSchema.safeParse({ organizationId: 1, legalEntityId: 2, stakeholderGroupId: 3, humanRole: "Founder" }).success).toBe(true);
    expect(activeContextInputSchema.safeParse({ organizationId: 1, legalEntityId: 0, stakeholderGroupId: 3, humanRole: "Founder" }).success).toBe(false);
  });

  it("rejects a requirements record that cites an unapproved source", () => {
    const result = requirementInputSchema.safeParse({
      code: "DATA-010",
      category: "Knowledge",
      question: "Can a public upload enter a context pack?",
      answer: "No, only reviewed repository paths are allowed.",
      status: "confirmed",
      priority: "P0",
      evidencePaths: ["unapproved/private-note.md"],
    });
    expect(result.success).toBe(false);
  });

  it("requires a substantive human rationale to resolve a decision gate", () => {
    expect(decisionInputSchema.safeParse({ gateId: 1, decision: "approved", rationale: "Reviewed source packet and pilot boundary." }).success).toBe(true);
    expect(decisionInputSchema.safeParse({ gateId: 1, decision: "approved", rationale: "yes" }).success).toBe(false);
  });

  it("blocks all consequential action classes in synthetic-only mode", () => {
    for (const action of ["financial", "regulated", "external_communication", "production_access"] as const) {
      expect(() => assertSyntheticPilotAllows(action)).toThrow(/Synthetic-only pilot mode blocks/);
    }
    expect(() => assertSyntheticFileSensitivity("synthetic_demo")).not.toThrow();
    expect(() => assertSyntheticFileSensitivity("restricted")).toThrow(/synthetic-demo/);
  });

  it("calculates dashboard readiness deterministically", () => {
    expect(getReadinessScore([75, 55, 70, 45, 25])).toBe(54);
    expect(getReadinessScore([])).toBe(0);
  });

  it("recognizes every owner-notification trigger category", () => {
    for (const type of ["decision_gate", "failed_evaluation", "missing_evidence", "sla_risk", "manual_review_exception"]) {
      expect(notificationTypeSchema.safeParse(type).success).toBe(true);
    }
  });

  it("identifies SLA and independent-review exceptions that require owner notification", () => {
    const now = Date.UTC(2026, 7, 27, 12, 0, 0);
    expect(isDecisionGateSlaRisk(new Date(now + 1000 * 60 * 60 * 47), now)).toBe(true);
    expect(isDecisionGateSlaRisk(new Date(now + 1000 * 60 * 60 * 49), now)).toBe(false);
    expect(isDecisionGateSlaRisk(new Date(now - 1000), now)).toBe(true);
    expect(requiresManualReviewException("under_review", false)).toBe(true);
    expect(requiresManualReviewException("approved", false)).toBe(true);
    expect(requiresManualReviewException("under_review", true)).toBe(false);
  });

  it("enforces designated decision-owner access and composes the founder action", () => {
    expect(isDesignatedDecisionOwner("admin", "observer")).toBe(true);
    expect(isDesignatedDecisionOwner("user", "decision_owner")).toBe(true);
    expect(isDesignatedDecisionOwner("user", "observer")).toBe(false);
    expect(composeDashboardSummary([40, 80], [{ id: 7, title: "G1 — Founder review", decisionQuestion: "Proceed?", owner: "Founder" }])).toEqual({ readiness: 60, founderAction: { gateId: 7, title: "G1 — Founder review", detail: "Proceed?", owner: "Founder" } });
    expect(composeDashboardSummary([], []).founderAction.gateId).toBeNull();
  });

  it("derives the full safety-scan notification matrix from actual scan conditions", () => {
    expect(getSafetyScanNotificationTypes({ pendingGate: true, slaRisk: true, missingEvidence: true, failedEvaluation: true, manualReviewException: true })).toEqual(["decision_gate", "sla_risk", "missing_evidence", "failed_evaluation", "manual_review_exception"]);
    expect(getSafetyScanNotificationTypes({})).toEqual([]);
  });
});
