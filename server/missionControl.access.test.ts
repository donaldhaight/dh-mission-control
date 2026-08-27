import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createUnauthenticatedContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Mission Control protected procedure boundary", () => {
  it("rejects unauthenticated dashboard and safety-scan requests before service execution", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    await expect(caller.missionControl.dashboard()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.missionControl.runSafetyScan()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
