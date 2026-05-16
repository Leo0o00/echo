import { ConvexError, v } from "convex/values"
import { components, internal } from "../_generated/api"
import { action, mutation, query } from "../_generated/server"
import { supportAgent } from "../system/ai/agents/supporAgent"
import { paginationOptsValidator } from "convex/server"
import { saveMessage } from "@convex-dev/agent"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export const enhanceResponse = action({
  args: {
    prompt: v.string(),
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

    const response = await generateText({
      model: google("gemini-3.1-flash-lite-preview"),
      messages: [
        {
          role: "system",
          content:
            "Enhance the operator's message to be more professional, clear, and helpful while maintaining their intent and key information. Just reply with the improved message. Don't ask questions or try to engage the operator in a conversation.",
        },
        {
          role: "user",
          content: args.prompt,
        },
      ],
    })

    return response.text
  },
})

export const create = mutation({
  args: {
    prompt: v.string(),
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
        message: "Invalid Organization ID",
      })
    }

    if (conversation.status === "resolved") {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Conversation resolved",
      })
    }

    if (conversation.status === "unresolved") {
      await ctx.db.patch(args.conversationId, {
        status: "escalated",
      })
    }

    // TODO: Implement subscription check

    await saveMessage(ctx, components.agent, {
      threadId: conversation.threadId,
      // TODO: Check if "agentName" is needed or not
      agentName: identity.familyName,
      message: {
        role: "assistant",
        content: args.prompt,
      },
    })
  },
})

export const getMany = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
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

    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
      .unique()

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      })
    }

    if (conversation.organizationId !== orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid Organization ID",
      })
    }

    const paginated = await supportAgent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts,
    })

    return paginated
  },
})
