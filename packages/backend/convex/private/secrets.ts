import { ConvexError, v } from "convex/values"
import { mutation } from "../_generated/server"
import { internal } from "../_generated/api"

export const upsert = mutation({
  args: {
    service: v.union(v.literal("vapi")),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (identity == null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      })
    }

    if (
      !identity.o ||
      typeof identity.o !== "object" ||
      !("id" in identity.o) ||
      typeof identity.o.id !== "string"
    ) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      })
    }
    const orgId = identity.o.id

    // TODO: Check for subscription

    await ctx.scheduler.runAfter(0, internal.system.secrets.upsert, {
      service: args.service,
      organizationId: orgId,
      value: args.value,
    })
  },
})
