"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  Calendar,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Receipt,
  Settings,
  Users,
  X,
  UserCircle,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  School
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import React from "react"

// Constants
const SIDEBAR_COOKIE_NAME = "sidebar-expanded"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year
const SIDEBAR_WIDTH = 240
const SIDEBAR_COLLAPSED_WIDTH = 64

export type SidebarProps = {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Load user and sidebar state
  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      setUser(JSON.parse(userStr))
    }

    // Check if sidebar collapsed state is saved in localStorage
    const sidebarCollapsed = localStorage.getItem("sidebarCollapsed")
    if (sidebarCollapsed) {
      setIsCollapsed(sidebarCollapsed === "true")
    } else {
      // Check cookie if localStorage isn't set
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
        ?.split("=")[1]
      
      if (cookieValue) {
        setIsCollapsed(cookieValue === "false")
      }
    }
  }, [setIsCollapsed])

  // Save sidebar collapsed state
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarCollapsed", isCollapsed.toString())
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${!isCollapsed}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    }
  }, [isCollapsed])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the system",
    })
    router.push("/login")
  }

  if (!user) return null

  // Define navigation items based on user role
  let navItems: { href: string; label: string; icon: React.ElementType }[] = []

  if (user.role === "admin") {
    navItems = [
      { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/admin/students", label: "Students", icon: Users },
      { href: "/dashboard/admin/staff", label: "Staff", icon: Users },
      { href: "/dashboard/admin/attendance", label: "Attendance", icon: Calendar },
      { href: "/dashboard/admin/classes", label: "Classes", icon: School },
      { href: "/dashboard/admin/fees", label: "Fees", icon: Receipt },
      { href: "/dashboard/admin/vouchers", label: "Vouchers", icon: FileText },
      { href: "/dashboard/admin/results", label: "Results", icon: BookOpen },
      { href: "/dashboard/admin/reports", label: "Reports", icon: BarChart3 },
      { href: "/dashboard/admin/setting", label: "Settings", icon: Settings },
    ]
  } else if (user.role === "teacher") {
    navItems = [
      { href: "/dashboard/teacher", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/teacher/attendance", label: "Attendance", icon: Calendar },
      { href: "/dashboard/teacher/results", label: "Results", icon: BookOpen },
      { href: "/dashboard/teacher/reports", label: "Reports", icon: BarChart3 },
    ]
  } else if (user.role === "student") {
    navItems = [
      { href: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard },
      { href: "/results", label: "Results", icon: BookOpen },
      { href: "/fees", label: "Fees", icon: Receipt },
    ]
  }

  // Sidebar main component
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden", 
          isOpen ? "block" : "hidden")}
        onClick={() => setIsOpen(false)}
      />
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-background shadow-sm",
          "transition-[width,transform] duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "w-[64px]" : "w-[240px]"
        )}
      >
        {/* Sidebar Header */}
        <header className="flex h-14 items-center border-b px-4">
          <Link
            href={`/dashboard/${user.role}`}
            className={cn("flex items-center gap-2 font-semibold", 
              isCollapsed && "justify-center")}
          >
            <Home className="h-5 w-5 text-primary" />
            {!isCollapsed && <span className="text-primary">School MS</span>}
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsOpen(false)} 
            className="ml-auto lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </header>
        
        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto py-2">
          <nav className="flex flex-col gap-1 px-2">
            <TooltipProvider delayDuration={0}>
              {navItems.map((item) => (
                isCollapsed ? (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                          pathname === item.href 
                            ? "bg-accent text-accent-foreground" 
                            : "text-muted-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="border bg-background text-foreground">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex h-9 items-center gap-3 rounded-md px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      pathname === item.href 
                        ? "bg-accent text-accent-foreground" 
                        : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              ))}
            </TooltipProvider>
          </nav>
        </div>
        
        {/* Sidebar Footer */}
        <footer className="border-t p-2">
          {user.role === "teacher" && (
            <>
              <TooltipProvider delayDuration={0}>
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/dashboard/teacher/profile"
                        className={cn(
                          "flex h-10 items-center justify-center rounded-md hover:bg-accent transition-colors",
                          pathname === "/dashboard/teacher/profile" && "bg-accent/50"
                        )}
                      >
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={user.id === "teacher1" ? "/teacher1.jpg" : "/teacher2.jpg"} alt={user.name} />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {user.name.split(' ').map((word: string) => word[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="border bg-background text-foreground">
                      View Profile
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    href="/dashboard/teacher/profile"
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                      pathname === "/dashboard/teacher/profile" && "bg-accent/50 text-accent-foreground"
                    )}
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.id === "teacher1" ? "/teacher1.jpg" : "/teacher2.jpg"} alt={user.name} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {user.name.split(' ').map((word: string) => word[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-grow overflow-hidden">
                      <span className="font-medium truncate">{user.name}</span>
                      <span className="text-xs text-muted-foreground truncate">View Profile</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                )}
              </TooltipProvider>
              <Separator className="my-2" />
            </>
          )}
          
          {/* Logout button */}
          <TooltipProvider delayDuration={0}>
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="w-full h-9 rounded-md hover:bg-accent hover:text-accent-foreground"
                  >
                    <LogOut className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="border bg-background text-foreground">
                  Logout
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start px-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <LogOut className="mr-2 h-5 w-5" />
                <span>Logout</span>
              </Button>
            )}
          </TooltipProvider>
          
          {/* Collapse toggle button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className="mt-4 w-full h-9 justify-center text-muted-foreground/70 hover:text-muted-foreground hover:bg-accent"
          >
            {isCollapsed ? 
              <ChevronRight className="h-5 w-5" /> : 
              <ChevronLeft className="h-5 w-5" />
            }
          </Button>
        </footer>
      </aside>
      
      {/* Mobile menu trigger */}
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-40 lg:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </>
  )
}
