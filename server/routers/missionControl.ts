import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  activeContextInputSchema,
  artifactDraftInputSchema,
  artifactReviewInputSchema,
  contextPackInputSchema,
  decisionInputSchema,
  fileProvenanceInputSchema,
  requirementInputSchema,
} from "../../shared/missionControl";
import {
  createArtifactReview,
  createContextPack,
  createRequirement,
  decideGate,
  generateArtifactDraft,
  getDashboard,
  getMissionDetail,
  listAudit,
  listContexts,
  listEvaluations,
  listFiles,
  listMissions,
  listNotifications,
  listRequirements,
  runSafetyScan,
  setDefaultContext,
  uploadFileReference,
} from "../missionControl";

export const missionControlRouter = router({
  dashboard: protectedProcedure.query(({ ctx }) => getDashboard(ctx.user)),
  contexts: protectedProcedure.query(({ ctx }) => listContexts(ctx.user)),
  setActiveContext: protectedProcedure.input(activeContextInputSchema).mutation(({ ctx, input }) => setDefaultContext(ctx.user, input)),
  requirements: router({
    list: protectedProcedure.query(({ ctx }) => listRequirements(ctx.user)),
    create: protectedProcedure.input(requirementInputSchema).mutation(({ ctx, input }) => createRequirement(ctx.user, input)),
  }),
  missions: router({
    list: protectedProcedure.query(({ ctx }) => listMissions(ctx.user)),
    detail: protectedProcedure.input(z.object({ missionId: z.number().int().positive() })).query(({ ctx, input }) => getMissionDetail(ctx.user, input.missionId)),
  }),
  contextPacks: router({
    create: protectedProcedure.input(contextPackInputSchema).mutation(({ ctx, input }) => createContextPack(ctx.user, input)),
  }),
  artifacts: router({
    generateDraft: protectedProcedure.input(artifactDraftInputSchema).mutation(({ ctx, input }) => generateArtifactDraft(ctx.user, input)),
    review: protectedProcedure.input(artifactReviewInputSchema).mutation(({ ctx, input }) => createArtifactReview(ctx.user, input)),
  }),
  decisions: router({
    resolveGate: protectedProcedure.input(decisionInputSchema).mutation(({ ctx, input }) => decideGate(ctx.user, input)),
  }),
  files: router({
    list: protectedProcedure.input(z.object({ missionId: z.number().int().positive().optional() }).optional()).query(({ ctx, input }) => listFiles(ctx.user, input?.missionId)),
    upload: protectedProcedure
      .input(z.object({ provenance: fileProvenanceInputSchema, contentBase64: z.string().min(4).max(7_000_000) }))
      .mutation(({ ctx, input }) => uploadFileReference(ctx.user, { ...input.provenance, contentBase64: input.contentBase64 })),
  }),
  evaluations: protectedProcedure.query(({ ctx }) => listEvaluations(ctx.user)),
  audit: protectedProcedure.query(({ ctx }) => listAudit(ctx.user)),
  notifications: protectedProcedure.query(({ ctx }) => listNotifications(ctx.user)),
  runSafetyScan: protectedProcedure.mutation(({ ctx }) => runSafetyScan(ctx.user)),
});
