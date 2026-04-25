"use client"

import { api } from "@workspace/backend/_generated/api"
import { useQuery } from "convex/react"

export default function Page() {
  const users = useQuery(api.users.getMany)

  return (
    <div className="flex min-h-svh items-center justify-center">
      <p>apps/widget</p>
    </div>
  )
}
