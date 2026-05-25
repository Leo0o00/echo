"use client"

import { GlobeIcon, PhoneCallIcon, PhoneIcon, WorkflowIcon } from "lucide-react"
import { type Feature, PluginCard } from "../components/plugin-card"
import { useMutation, useQuery } from "convex/react"
import { api } from "@workspace/backend/_generated/api"
import { toast } from "sonner"
import { useState } from "react"
import z from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { VapiConnectedView } from "../components/vapi-connected-view"

const vapiFeatures: Feature[] = [
  {
    icon: GlobeIcon,
    label: "Web voice calls",
    description: "Voice chat directly in your app",
  },
  {
    icon: PhoneIcon,
    label: "Phone numbers",
    description: "Get dedicated business lines",
  },
  {
    icon: PhoneCallIcon,
    label: "Outbound calls",
    description: "Automated customer outreach",
  },
  {
    icon: WorkflowIcon,
    label: "Workflows",
    description: "Custom conversation flows",
  },
]

const formSchema = z.object({
  publicApiKey: z.string().min(1, { message: "Public API key is required" }),
  privateApiKey: z.string().min(1, { message: "Private API key is required" }),
})

const VapiPluginForm = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (value: boolean) => void
}) => {
  const upsertSecret = useMutation(api.private.secrets.upsert)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      publicApiKey: "",
      privateApiKey: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await upsertSecret({
        service: "vapi",
        value: {
          publicApiKey: values.publicApiKey,
          privateApiKey: values.privateApiKey,
        },
      })
      setOpen(false)
      toast.success("Vapi secret created")
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enable Vapi</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Your API keys are safely encrypted and stored using AWS Secrets
          Manager.
        </DialogDescription>
        <form
          className="flex flex-col gap-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              control={form.control}
              name="publicApiKey"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="public-api-key-form-field">
                    Public API key
                  </FieldLabel>
                  <Input
                    {...field}
                    id="public-api-key-form-field"
                    aria-invalid={fieldState.invalid}
                    placeholder="Your public API key"
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="privateApiKey"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="private-api-key-form-field">
                    Private API key
                  </FieldLabel>
                  <Input
                    {...field}
                    id="private-api-key-form-field"
                    aria-invalid={fieldState.invalid}
                    placeholder="Your private API key"
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <DialogFooter>
              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting ? "Connecting..." : "Connect"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
const VapiPluginRemoveForm = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (value: boolean) => void
}) => {
  const removePlugin = useMutation(api.private.plugins.remove)

  const onSubmit = async () => {
    try {
      await removePlugin({
        service: "vapi",
      })
      setOpen(false)
      toast.success("Vapi plugin removed")
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disconnect Vapi</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to disconnect the Vapi plugin?
        </DialogDescription>
        <DialogFooter>
          <Button onClick={onSubmit} variant="destructive">
            Disconnect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const VapiView = () => {
  const vapiPlugin = useQuery(api.private.plugins.getOne, { service: "vapi" })

  const [connectOpen, setConnectOpen] = useState(false)
  const [removeOpen, setRemoveOpen] = useState(false)

  const toogleConnection = () => {
    if (vapiPlugin) {
      setRemoveOpen(true)
    } else {
      setConnectOpen(true)
    }
  }

  return (
    <>
      <VapiPluginForm open={connectOpen} setOpen={setConnectOpen} />
      <VapiPluginRemoveForm open={removeOpen} setOpen={setRemoveOpen} />
      <div className="flex min-h-screen flex-col bg-muted p-8">
        <div className="mx-auto w-full max-w-3xl">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl">Vapi Plugin</h1>
            <p className="text-muted-foreground">
              Connect Vapi to enable AI voice calls and phone support
            </p>
          </div>
          <div className="mt-8">
            {vapiPlugin ? (
              <VapiConnectedView onDisconnect={toogleConnection} />
            ) : (
              <PluginCard
                serviceImage="/vapi.jpg"
                serviceName="Vapi"
                features={vapiFeatures}
                isDisabled={vapiPlugin === undefined}
                onSubmit={toogleConnection}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
