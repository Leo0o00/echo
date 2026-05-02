"use client"

import { useVapi } from "@/modules/widget/hooks/use-vapi"
import { WidgetView } from "@/modules/widget/ui/views/widget-view"
import { api } from "@workspace/backend/_generated/api"
import { Button } from "@workspace/ui/components/button"
import { useQuery } from "convex/react"
import { use } from "react"

interface Props {
  searchParams: Promise<{
    organizationId: string
  }>
}

const Page = ({ searchParams }: Props) => {
  const { organizationId } = use(searchParams)

  return <WidgetView organizationId={organizationId} />
}

export default Page
