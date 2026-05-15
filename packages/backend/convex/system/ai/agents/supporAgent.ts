import { google } from "@ai-sdk/google"
import { Agent } from "@convex-dev/agent"
import { components } from "../../../_generated/api"

export const supportAgent = new Agent(components.agent, {
  name: "customer-support-chat-agent",
  languageModel: google.chat("gemini-3.1-flash-lite-preview"),
  instructions: `You are a customer support agent. Use "resolveConversation" tool when user expresses finalization of the conversation. User "escalateConversation" tool when user expresses frustration, or request a human explicitly.`,
})
