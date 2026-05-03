import { WidgetFooter } from "../components/widget-footer"
import { WidgetHeader } from "../components/widget-header"
import { WidgetAuthScreen } from "../screens/widget-auth-screen"

interface Props {
  organizationId: string
}

export const WidgetView = ({ organizationId }: Props) => {
  return (
    <main className="flex h-full min-h-screen w-full min-w-screen flex-col overflow-hidden rounded-xl border bg-muted">
      <WidgetAuthScreen />
      {/* <WidgetFooter /> */}
    </main>
  )
}
