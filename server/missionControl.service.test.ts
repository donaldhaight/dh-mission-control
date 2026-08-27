import { describe, expect, it, vi } from "vitest";
import { decideGate, getDashboard, runSafetyScan, setDefaultContext } from "./missionControl";

const user = {
  id: 41,
  openId: "synthetic-test-owner",
  name: "Synthetic Founder",
  email: "founder@example.test",
  loginMethod: "test",
  role: "admin" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

const activeContext = {
  id: 1,
  userId: user.id,
  organizationId: 10,
  organizationName: "Synthetic Organization",
  legalEntityId: 11,
  legalEntityName: "Synthetic Entity",
  stakeholderGroupId: 12,
  stakeholderGroupName: "Founder Group",
  humanRole: "Founder / Decision Owner",
  accessLevel: "admin",
  syntheticOnly: true,
  label: "Synthetic Organization · Synthetic Entity · Founder Group · Founder / Decision Owner",
};

function queryRows<T>(rows: T[]) {
  const chain = rows as T[] & { where: () => typeof chain; orderBy: () => typeof chain; limit: () => typeof chain; innerJoin: () => typeof chain };
  chain.where = () => chain;
  chain.orderBy = () => chain;
  chain.limit = () => chain;
  chain.innerJoin = () => chain;
  return chain;
}

function mockDb(selectResults: unknown[][]) {
  const results = [...selectResults];
  const insertValues = vi.fn(async () => undefined);
  const updates: unknown[] = [];
  return {
    select: vi.fn(() => ({ from: vi.fn(() => queryRows(results.shift() ?? [])) })),
    insert: vi.fn(() => ({ values: insertValues })),
    update: vi.fn(() => ({ set: vi.fn((value: unknown) => { updates.push(value); return { where: vi.fn(async () => undefined) }; }) })),
    insertValues,
    updates,
  };
}

describe("Mission Control service contracts", () => {
  it("allows only a user-owned active context to become the protected default", async () => {
    const db = mockDb([[{ id: 9, userId: user.id }]]);
    const audit = vi.fn(async () => "mc_context");
    const context = await setDefaultContext(user, { organizationId: 10, legalEntityId: 11, stakeholderGroupId: 12, humanRole: "Founder / Decision Owner" }, {
      ensurePilotData: async () => undefined,
      getDb: async () => db as any,
      getContextById: async () => activeContext,
      audit,
    });

    expect(context.label).toContain("Synthetic Organization");
    expect(db.updates).toEqual([{ isDefault: false }, { isDefault: true }]);
    expect(audit).toHaveBeenCalledWith(user, activeContext.label, "context.activated", "user_context", 9, expect.any(Object));

    const forbiddenDb = mockDb([[]]);
    await expect(setDefaultContext(user, { organizationId: 10, legalEntityId: 11, stakeholderGroupId: 12, humanRole: "Observer" }, {
      ensurePilotData: async () => undefined,
      getDb: async () => forbiddenDb as any,
    })).rejects.toThrow(/not authorized/);
  });

  it("records a designated-owner decision, updates the gate and linked work, and emits an audit event", async () => {
    const db = mockDb([[{ id: 55, status: "pending", syntheticOnly: true, workItemId: 77 }]]);
    const audit = vi.fn(async () => "mc_decision");
    const result = await decideGate(user, { gateId: 55, decision: "approved", rationale: "The reviewed synthetic pilot packet meets the stated boundary." }, {
      prepareMissionControl: async () => activeContext,
      getDb: async () => db as any,
      audit,
    });

    expect(result).toEqual({ gateId: 55, status: "approved" });
    expect(db.insertValues).toHaveBeenCalledTimes(1);
    expect(db.updates).toEqual([{ status: "approved" }, { status: "complete" }]);
    expect(audit).toHaveBeenCalledWith(user, activeContext.label, "decision_gate.resolved", "decision_gate", 55, expect.objectContaining({ humanGate: true }));

    await expect(decideGate({ ...user, role: "user" }, { gateId: 55, decision: "approved", rationale: "A non-owner attempt must not resolve a gate." }, {
      prepareMissionControl: async () => ({ ...activeContext, accessLevel: "observer" }),
    })).rejects.toThrow(/designated decision owner/);
  });

  it("composes the dashboard from real service result sets and selects the first pending founder action", async () => {
    const db = mockDb([
      [{ readinessScore: 40 }, { readinessScore: 80 }],
      [{ id: 2, name: "Synthetic experiment" }],
      [{ id: 3, severity: "high" }],
      [{ id: 4, title: "G0", decisionQuestion: "Proceed with the pilot?", owner: "Founder" }],
      [{ id: 5, title: "Synthetic mission" }],
      [{ id: 6, status: "passed" }],
      [{ id: 7, eventType: "seeded" }],
    ]);
    const dashboard = await getDashboard(user, { prepareMissionControl: async () => activeContext, getDb: async () => db as any });

    expect(dashboard.readiness).toBe(60);
    expect(dashboard.founderAction).toEqual({ gateId: 4, title: "G0", detail: "Proceed with the pilot?", owner: "Founder" });
    expect(dashboard.activeExperiments).toHaveLength(1);
  });

  it("queues every safety-scan trigger category and does not requeue an existing decision-gate alert", async () => {
    const nearDueGate = { id: 1, title: "G0", decisionQuestion: "Approve?", owner: "Founder", dueAt: new Date(Date.now() + 36 * 60 * 60 * 1000) };
    const incompleteWork = { id: 2, title: "Synthetic evidence", assignedTeam: "Evidence Team" };
    const failedEvaluation = { id: 3, name: "Synthetic evaluation", findings: "Evidence is incomplete." };
    const artifactWithoutReview = { id: 4, title: "Draft brief", status: "under_review" };
    const db = mockDb([
      [nearDueGate], [incompleteWork], [failedEvaluation], [artifactWithoutReview],
      [], [], [],
    ]);
    const queueNotification = vi.fn(async () => null);
    const audit = vi.fn(async () => "mc_scan");
    const scan = await runSafetyScan(user, { prepareMissionControl: async () => activeContext, getDb: async () => db as any, queueNotification, audit });

    expect(queueNotification.mock.calls.map(call => call[0])).toEqual(["decision_gate", "sla_risk", "missing_evidence", "failed_evaluation", "manual_review_exception"]);
    expect(scan.queued).toHaveLength(5);
    expect(audit).toHaveBeenCalledWith(user, activeContext.label, "safety_scan.completed", "mission_control", null, expect.objectContaining({ pilotMode: "synthetic_only" }));

    const dedupDb = mockDb([[nearDueGate], [], [], [], [{ id: 99, type: "decision_gate" }]]);
    const duplicateQueue = vi.fn(async () => null);
    await runSafetyScan(user, { prepareMissionControl: async () => activeContext, getDb: async () => dedupDb as any, queueNotification: duplicateQueue, audit });
    expect(duplicateQueue.mock.calls.map(call => call[0])).not.toContain("decision_gate");
  });
});
