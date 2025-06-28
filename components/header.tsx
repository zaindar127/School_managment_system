"use client"

import React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Bell, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ label: string; href: string }>>([])

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
  }, [])

  useEffect(() => {
    // Generate breadcrumbs based on pathname
    if (pathname) {
      const pathSegments = pathname.split("/").filter((segment) => segment)
      const breadcrumbItems = pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join("/")}`
        let label = segment.charAt(0).toUpperCase() + segment.slice(1)

        // Handle dynamic routes
        if (segment.startsWith("[") && segment.endsWith("]")) {
          const paramName = segment.slice(1, -1)
          label = paramName.charAt(0).toUpperCase() + paramName.slice(1)
        }

        return { label, href }
      })

      setBreadcrumbs(breadcrumbItems)
    }
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem("user")
    toast.success("Logged out successfully", {
      description: "You have been logged out of the system",
    })
    router.push("/login")
  }

  if (!user) return null

  return (
    <header className="sticky top-0 z-10 flex flex-col border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex-1">
          <h1 className="text-lg font-semibold hidden md:block">
            {user.role === "admin"
              ? "Admin Panel"
              : user.role === "teacher"
                ? `Teacher Dashboard - Class ${user.class}`
                : `Student Dashboard - ${user.name}`}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-full relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
            <span className="sr-only">Notifications</span>
          </Button>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <User className="h-4 w-4" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>{user.name}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="mr-2 h-4 w-4 inline-block text-center">{user.role.charAt(0).toUpperCase()}</span>
                <span>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {breadcrumbs.length > 0 && (
        <div className="px-6 pb-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  {i === breadcrumbs.length - 1 ? (
                    <BreadcrumbItem>
                      <BreadcrumbLink href={crumb.href} aria-current="page">
                        {crumb.label}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  ) : (
                    <>
                      <BreadcrumbItem>
                        <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                    </>
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}
    </header>
  )
}
