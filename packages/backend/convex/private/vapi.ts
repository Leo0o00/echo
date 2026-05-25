import { VapiClient, Vapi } from "@vapi-ai/server-sdk"
import { internal } from "../_generated/api"
import { action } from "../_generated/server"
import { getSecretValue, parseSecretString } from "../lib/secrets"
import { ConvexError } from "convex/values"

export const getAssistants = action({
  args: {},
  handler: async (ctx): Promise<Vapi.Assistant[]> => {
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

    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: orgId,
        service: "vapi",
      }
    )

    if (!plugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Plugin not found",
      })
    }

    const secretName = plugin.secretName
    const secretValue = await getSecretValue(secretName)
    const secretData = parseSecretString<{
      publicApiKey: string
      privateApiKey: string
    }>(secretValue)

    if (!secretData) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Credentials not found",
      })
    }

    if (!secretData.privateApiKey || !secretData.publicApiKey) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Credentials incomplete. Please reconnect your Vapi account.",
      })
    }

    const vapiClient = new VapiClient({
      token: secretData.privateApiKey,
    })

    const assistants = await vapiClient.assistants.list()

    return assistants
  },
})

export const getPhoneNumbers = action({
  args: {},
  handler: async (ctx): Promise<Vapi.ListPhoneNumbersResponseItem[]> => {
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

    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: orgId,
        service: "vapi",
      }
    )

    if (!plugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Plugin not found",
      })
    }

    const secretName = plugin.secretName
    const secretValue = await getSecretValue(secretName)
    const secretData = parseSecretString<{
      publicApiKey: string
      privateApiKey: string
    }>(secretValue)

    if (!secretData) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Credentials not found",
      })
    }

    if (!secretData.privateApiKey || !secretData.publicApiKey) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Credentials incomplete. Please reconnect your Vapi account.",
      })
    }

    const vapiClient = new VapiClient({
      token: secretData.privateApiKey,
    })

    const phoneNumbers = await vapiClient.phoneNumbers.list()

    return phoneNumbers
  },
})
