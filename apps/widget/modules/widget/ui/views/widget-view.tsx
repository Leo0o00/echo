import { useAtomValue } from "jotai"
import { WidgetAuthScreen } from "../screens/widget-auth-screen"
import { screenAtom } from "../../atoms/widget-atoms"
import { WidgetErrorScreen } from "../screens/widget-error-screen"
import { WidgetLoadingScreen } from "../screens/widget-loading-screen"
import { WidgetSelectionScreen } from "../screens/widget-selection-screen"
import { WidgetChatScreen } from "../screens/widget-chat-screen"

interface Props {
  organizationId: string | null
}

export const WidgetView = ({ organizationId }: Props) => {
  const screen = useAtomValue(screenAtom)

  const screenComponents = {
    error: <WidgetErrorScreen />,
    loading: <WidgetLoadingScreen organizationId={organizationId} />,
    auth: <WidgetAuthScreen />,
    voice: <p>TODO: voice</p>,
    inbox: <p>TODO: inbox</p>,
    selection: <WidgetSelectionScreen />,
    chat: <WidgetChatScreen />,
    contact: <p>TODO: contact</p>,
  }

  return (
    <main className="flex h-full min-h-screen w-full min-w-screen flex-col overflow-hidden rounded-xl border bg-muted">
      {screenComponents[screen]}
    </main>
  )
}
