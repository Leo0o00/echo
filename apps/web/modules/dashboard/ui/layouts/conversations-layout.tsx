import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@workspace/ui/components/resizable"
import { ConversationsPanel } from "../components/conversations-panel"

export const ConversationsLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <ResizablePanelGroup className="h-full flex-1" orientation="horizontal">
      <ResizablePanel defaultSize="20%" maxSize="60%" minSize="15%">
        <ConversationsPanel />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel className="h-full" defaultSize="80%">
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
