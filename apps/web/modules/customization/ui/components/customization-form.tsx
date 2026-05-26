import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

import { Input } from "@workspace/ui/components/input"
import { Separator } from "@workspace/ui/components/separator"
import { Textarea } from "@workspace/ui/components/textarea"
import { Doc } from "@workspace/backend/_generated/dataModel"
import { useMutation } from "convex/react"
import { api } from "@workspace/backend/_generated/api"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { FormSchema } from "../types"
import { widgetSettingsSchema } from "../schemas"
import { VapiFormFields } from "./vapi-form-fields"

type WidgetSettings = Doc<"widgetSettings">

interface CustomizationFormProps {
  initialData?: WidgetSettings | null
  hasVapiPlugin: boolean
}

export const CustomizationForm = ({
  initialData,
  hasVapiPlugin,
}: CustomizationFormProps) => {
  const upsertWidgetSettings = useMutation(api.private.widgetSettings.upsert)

  const form = useForm<FormSchema>({
    resolver: zodResolver(widgetSettingsSchema),
    defaultValues: {
      greetMessage:
        initialData?.greetMessage || "Hi! How can I help you today?",
      defaultSuggestions: {
        suggestion1: initialData?.defaultSuggestions.suggestion1 || "",
        suggestion2: initialData?.defaultSuggestions.suggestion2 || "",
        suggestion3: initialData?.defaultSuggestions.suggestion3 || "",
      },
      vapiSettings: {
        assistantId: initialData?.vapiSettings.assistantId || "",
        phoneNumber: initialData?.vapiSettings.phoneNumber || "",
      },
    },
  })

  const onSubmit = async (values: FormSchema) => {
    try {
      const vapiSettings: WidgetSettings["vapiSettings"] = {
        assistantId:
          values.vapiSettings.assistantId === "none"
            ? ""
            : values.vapiSettings.assistantId,
        phoneNumber:
          values.vapiSettings.phoneNumber === "none"
            ? ""
            : values.vapiSettings.phoneNumber,
      }

      await upsertWidgetSettings({
        greetMessage: values.greetMessage,
        defaultSuggestions: values.defaultSuggestions,
        vapiSettings,
      })

      toast.success("Widget settings saved")
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>General Chat Settings</CardTitle>
          <CardDescription>
            Configure basic chat widget behavior and messages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FieldGroup>
            <Controller
              control={form.control}
              name="greetMessage"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="greet-message-form-field">
                    Greeting Message
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="greet-message-form-field"
                    aria-invalid={fieldState.invalid}
                    placeholder="Welcome message shown when chat open"
                  />
                  <FieldDescription>
                    The first message customers see when they open the chat
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Separator />

          <div className="space-y-4">
            <div>
              <h3 className="mb-4 text-sm">Default Suggestions</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Quick reply suggestions shown to customers to help guide the
                conversation
              </p>
              <div className="space-y-4">
                <FieldGroup>
                  <Controller
                    control={form.control}
                    name="defaultSuggestions.suggestion1"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="suggestion1-form-field">
                          Suggestion 1
                        </FieldLabel>
                        <Input
                          {...field}
                          id="suggestion1-form-field"
                          aria-invalid={fieldState.invalid}
                          placeholder="e.g., How do I get started?"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="defaultSuggestions.suggestion2"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="suggestion2-form-field">
                          Suggestion 2
                        </FieldLabel>
                        <Input
                          {...field}
                          id="suggestion2-form-field"
                          aria-invalid={fieldState.invalid}
                          placeholder="e.g., What are your pricing plans?"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="defaultSuggestions.suggestion3"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="suggestion3-form-field">
                          Suggestion 3
                        </FieldLabel>
                        <Input
                          {...field}
                          id="suggestion3-form-field"
                          aria-invalid={fieldState.invalid}
                          placeholder="e.g., I need help with my account"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasVapiPlugin && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Voice Assistant Settings</CardTitle>
            <CardDescription>
              Configure voice calling features powered by Vapi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <VapiFormFields form={form} />
          </CardContent>
        </Card>
      )}

      <div className="mt-4 flex justify-end">
        <Button disabled={form.formState.isSubmitting} type="submit">
          Save Settings
        </Button>
      </div>
    </form>
  )
}
