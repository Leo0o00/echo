import { Controller, UseFormReturn } from "react-hook-form"
import {
  useVapiAssistants,
  useVapiPhoneNumbers,
} from "@/modules/plugins/hooks/use-vapi-data"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { FormSchema } from "../types"

interface VapiFormFieldsProps {
  form: UseFormReturn<FormSchema>
}

export const VapiFormFields = ({ form }: VapiFormFieldsProps) => {
  const { data: assistants, isLoading: assistantsLoading } = useVapiAssistants()
  const { data: phoneNumbers, isLoading: phoneNumbersLoading } =
    useVapiPhoneNumbers()

  const assistantsItems = [
    {
      value: "none",
      label: "None",
    },
  ]

  assistants.map((a) => {
    assistantsItems.push({
      value: a.id,
      label: `${a.name || "Unnamed Assistant"} - ${a.model?.model || "Unknown model"}`,
    })
  })

  const phoneNumbersItems = [
    {
      value: "none",
      label: "None",
    },
  ]

  phoneNumbers.map((p) => {
    phoneNumbersItems.push({
      value: p.number || p.id,
      label: `${p.number || "Unknown"} - ${p.name || "Unnamed"}`,
    })
  })

  const disabled = form.formState.isSubmitting

  return (
    <>
      <FieldGroup>
        <Controller
          control={form.control}
          name="vapiSettings.assistantId"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Voice Assistant</FieldLabel>
              <Select
                defaultValue={field.value}
                items={assistantsItems}
                value={field.value}
                onValueChange={field.onChange}
                disabled={assistantsLoading || disabled}
                aria-invalid={fieldState.invalid}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      assistantsLoading
                        ? "Loading assistants..."
                        : "Select an assistant"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {assistantsItems.map((assistant, i) => (
                    <SelectItem key={i} value={assistant.value}>
                      {assistant.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                The Vapi assistant to use for voice calls
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="vapiSettings.phoneNumber"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Voice Assistant</FieldLabel>
              <Select
                defaultValue={field.value}
                value={field.value}
                items={phoneNumbersItems}
                onValueChange={field.onChange}
                disabled={phoneNumbersLoading || disabled}
                aria-invalid={fieldState.invalid}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      phoneNumbersLoading
                        ? "Loading phone numbers..."
                        : "Select a phone number"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {phoneNumbersItems.map((phone, i) => (
                    <SelectItem key={i} value={phone.value}>
                      {phone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                Phone number to display in the widget
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </>
  )
}
