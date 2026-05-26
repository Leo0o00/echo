import { google } from "@ai-sdk/google"
import { Agent } from "@convex-dev/agent"
import { components } from "../../../_generated/api"
import { SUPPORT_AGENT_PROMPT } from "../constants"

export const supportAgent = new Agent(components.agent, {
  name: "customer-support-chat-agent",
  // TODO: Fix the error with the latest google model
  // This model models/gemini-3.1-flash-lite-preview is no longer available. Please update your code to use a newer model for the latest features and improvements.
  // The model dont respond to my messages
  languageModel: google.chat("gemini-flash-latest"),
  instructions: SUPPORT_AGENT_PROMPT,
})
