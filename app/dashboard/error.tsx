"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center p-4">
      <div className="space-y-4 max-w-md">
        <h1 className="text-4xl font-bold text-destructive">Dashboard Error</h1>
        <p className="text-muted-foreground">
          An error occurred while loading the dashboard. Please try again or contact support.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => reset()} variant="outline">
            Try again
          </Button>
          <Link href="/dashboard/admin">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
