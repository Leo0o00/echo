import { PremiumFeatureOverlay } from "@/modules/billing/ui/components/premium-feature-overlay"
import { Show } from "@clerk/nextjs"
import { FilesView } from "@/modules/files/ui/views/files-view"
import React from "react"

const Page = () => {
  return (
    <Show
      when={{ plan: "pro" }}
      fallback={
        <PremiumFeatureOverlay>
          <FilesView />
        </PremiumFeatureOverlay>
      }
    >
      <FilesView />
    </Show>
  )
}

export default Page
