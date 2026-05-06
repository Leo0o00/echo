import * as z from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { WidgetHeader } from "../components/widget-header"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { api } from "@workspace/backend/_generated/api"
import { useMutation } from "convex/react"
import { Doc } from "@workspace/backend/_generated/dataModel"
import {
  contactSessionIdAtomFamily,
  organizationIdAtom,
} from "../../atoms/widget-atoms"
import { useAtomValue, useSetAtom } from "jotai"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
})

// Temporary test organizationId, before we add state management
const organizationId = "123"

export const WidgetAuthScreen = () => {
  const organizationId = useAtomValue(organizationIdAtom)
  const setContactSessionId = useSetAtom(
    contactSessionIdAtomFamily(organizationId || "")
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  const createContactSession = useMutation(api.public.contactSessions.create)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!organizationId) {
      return
    }

    const metadata: Doc<"contactSessions">["metadata"] = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages?.join(","),
      plattform: navigator.platform,
      vendor: navigator.vendor,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      cookieEnabled: navigator.cookieEnabled,
      referrer: document.referrer || "direct",
      currentUrl: window.location.href,
    }

    const contactSessionId = await createContactSession({
      ...values,
      organizationId,
      metadata,
    })

    setContactSessionId(contactSessionId)
  }

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hey!</p>
          <p className="text-lg">Let&apos;s get you started</p>
        </div>
      </WidgetHeader>
      <form
        id="auth-form"
        className="flex flex-1 flex-col gap-y-4 p-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="auth-form-name-field">Name</FieldLabel>
                <Input
                  {...field}
                  id="auth-form-name-field"
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g. John Doe"
                  autoComplete="name"
                  className="h-10 bg-background"
                  type="text"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="auth-form-email-field">Email</FieldLabel>
                <Input
                  {...field}
                  id="auth-form-email-field"
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g. john.doe@example.com"
                  autoComplete="email"
                  className="h-10 bg-background"
                  type="email"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button
            disabled={form.formState.isSubmitting}
            size="lg"
            type="submit"
          >
            Continue
          </Button>
        </FieldGroup>
      </form>
    </>
  )
}
