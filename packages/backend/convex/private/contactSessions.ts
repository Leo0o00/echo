import { ConvexError, v } from "convex/values"
import { query } from "../_generated/server"

export const getOneByConversationId = query({
  args: {
    conversationId: v.id("conversations"),
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

    const conversation = await ctx.db.get(args.conversationId)

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      })
    }

    if (conversation.organizationId !== orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid organization id",
      })
    }

    const contactSession = await ctx.db.get(conversation.contactSessionId)

    return contactSession
  },
})
