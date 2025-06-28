"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import type { SidebarProps } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/sonner"
import { useTheme } from "next-themes"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const { resolvedTheme } = useTheme()

  // Check if the current path is in the student dashboard
  const isStudentDashboard = pathname.includes('/dashboard/student')

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/login")
    } else {
      const user = JSON.parse(userStr)
      setUserRole(user.role)
      setIsLoading(false)
    }

    // Check sidebar collapsed state
    const sidebarCollapsed = localStorage.getItem("sidebarCollapsed")
    if (sidebarCollapsed) {
      setIsCollapsed(sidebarCollapsed === "true")
    }
  }, [router])

  // Listen for changes to sidebar collapsed state
  useEffect(() => {
    const handleStorageChange = () => {
      const sidebarCollapsed = localStorage.getItem("sidebarCollapsed")
      if (sidebarCollapsed) {
        setIsCollapsed(sidebarCollapsed === "true")
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  // For student dashboard, don't show sidebar
  if (isStudentDashboard) {
    return (
      <div className="flex h-screen overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
          <Toaster />
        </div>
      </div>
    )
  }

  // For admin and teacher dashboards, show sidebar
  return (
    <div className="flex h-screen overflow-hidden">
      {!isStudentDashboard && (
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      )}
      <div
        className={cn(
          "flex flex-col flex-1 overflow-hidden transition-all duration-300",
          !isStudentDashboard && (isCollapsed ? "lg:ml-16" : "lg:ml-64")
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-8">{children}</main>
        <Toaster />
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}
