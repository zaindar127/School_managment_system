"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentAdmissions } from "@/components/recent-admissions"
import { AttendanceSummary } from "@/components/attendance-summary"
import { FeeSummary } from "@/components/fee-summary"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { 
  PieChart, LineChart, Calendar, Bell, Settings, UserPlus, 
  Download, Search, Plus, School, Users, BookOpen, 
  TrendingUp, Activity, DollarSign, AlertCircle,
  ChevronsUp, Sparkles, GraduationCap
} from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { generatePDF } from "@/lib/pdf-generator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { AdminEventsManagement } from "@/components/admin-events-management"

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showGreeting, setShowGreeting] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const headerScale = useTransform(scrollY, [0, 200], [1, 0.95])
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0.9])
  
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New admission request from Ahmed Khan", time: "5 min ago", read: false, type: "admission" },
    { id: 2, text: "Fee payment overdue for 12 students", time: "2 hours ago", read: false, type: "payment" },
    { id: 3, text: "Staff meeting scheduled for tomorrow", time: "Yesterday", read: true, type: "meeting" },
    { id: 4, text: "System maintenance completed", time: "2 days ago", read: true, type: "system" },
  ])

  // Check if user has already seen the greeting
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    
    // Check if this is the first login
    const hasSeenGreeting = localStorage.getItem('hasSeenAdminGreeting') === 'true'
    
    if (!hasSeenGreeting) {
      // Show greeting only on first visit
      setShowGreeting(true)
      
      // Set timeout to hide greeting
      const greetingTimer = setTimeout(() => {
        setShowGreeting(false)
        // Mark that user has seen the greeting
        localStorage.setItem('hasSeenAdminGreeting', 'true')
      }, 5000)
      
      return () => {
        clearTimeout(timer)
        clearTimeout(greetingTimer)
      }
    }
    
    return () => {
      clearTimeout(timer)
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  }

  const pulseVariants = {
    initial: { scale: 1 },
    pulse: { 
      scale: [1, 1.05, 1]
    }
  }

  const handleGenerateReport = () => {
    const reportData = [
      { class: "Nursery", totalStudents: 45, attendanceRate: "93.3%", feeCollection: "PKR 112,500" },
      { class: "Prep", totalStudents: 50, attendanceRate: "96.0%", feeCollection: "PKR 125,000" },
      { class: "One", totalStudents: 55, attendanceRate: "90.9%", feeCollection: "PKR 110,000" },
      { class: "Two", totalStudents: 48, attendanceRate: "93.8%", feeCollection: "PKR 120,000" },
      { class: "Three", totalStudents: 52, attendanceRate: "91.5%", feeCollection: "PKR 130,000" },
      { class: "Four", totalStudents: 47, attendanceRate: "94.2%", feeCollection: "PKR 141,000" },
    ]

    generatePDF({
      title: "School Summary Report",
      data: reportData,
      columns: [
        { header: "Class", key: "class" },
        { header: "Total Students", key: "totalStudents" },
        { header: "Attendance Rate", key: "attendanceRate" },
        { header: "Fee Collection", key: "feeCollection" },
      ],
      summary: [
        { label: "Total Students", value: "297" },
        { label: "Average Attendance", value: "93.3%" },
        { label: "Total Fee Collection", value: "PKR 738,500" },
      ],
      fileName: "school-summary-report.pdf"
    })
    
    toast.success("Report generated successfully")
  }

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    )
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case "admission": return <UserPlus className="h-4 w-4 text-blue-500" />;
      case "payment": return <DollarSign className="h-4 w-4 text-green-500" />;
      case "meeting": return <Users className="h-4 w-4 text-purple-500" />;
      case "system": return <Settings className="h-4 w-4 text-gray-500" />;
      default: return <AlertCircle className="h-4 w-4 text-amber-500" />;
    }
  };

  // Get time of day for greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <>
      {/* Welcome Overlay Animation */}
      <AnimatePresence>
        {showGreeting && (
          <motion.div 
            className="fixed inset-0 bg-primary/90 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.5, ease: "easeOut" } 
            }}
          >
            <motion.div 
              className="text-center text-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                transition: { delay: 0.3, duration: 0.5 } 
              }}
              exit={{ 
                scale: 1.2, 
                opacity: 0,
                transition: { duration: 0.5 } 
              }}
            >
              <Sparkles className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-2">{getTimeBasedGreeting()}, Administrator</h1>
              <p className="text-xl opacity-80">Welcome to your school management dashboard</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="space-y-6 pb-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        ref={mainRef}
      >
        {/* Header Section with Hero Banner */}
        <motion.div 
          variants={itemVariants}
          style={{ scale: headerScale, opacity: headerOpacity }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/90 to-primary p-6 text-white shadow-xl dark:from-primary-dark/90 dark:to-primary-dark"
        >
          <div className="absolute inset-0 bg-[url('/dashboard-pattern.svg')] opacity-10"></div>
          <motion.div 
            className="absolute right-0 bottom-0 opacity-10 -mb-8 -mr-8"
            animate={{ 
              y: [0, -10, 0], 
              rotate: [0, 2, 0] 
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          >
            <GraduationCap className="h-64 w-64" />
          </motion.div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <motion.h1 
                className="text-4xl font-bold tracking-tight text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: 0.2, duration: 0.5 }
                }}
              >
                Welcome back, Administrator
              </motion.h1>
              <motion.p 
                className="text-white/80 max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  transition: { delay: 0.4, duration: 0.5 }
                }}
              >
                Monitor your school's performance, manage admissions, and access all administrator tools from one place.
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Quick Action Buttons */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { 
              name: "New Admission", 
              icon: <UserPlus className="h-6 w-6" />, 
              description: "Register new students",
              color: "from-blue-500 to-blue-600", 
              hoverColor: "from-blue-600 to-blue-700",
              darkColor: "dark:from-blue-600 dark:to-blue-700",
              darkHoverColor: "dark:from-blue-700 dark:to-blue-800",
              onClick: () => router.push("/dashboard/admin/students/admission") 
            },
            { 
              name: "Generate Report", 
              icon: <Download className="h-6 w-6" />, 
              description: "Create school reports",
              color: "from-green-500 to-green-600", 
              hoverColor: "from-green-600 to-green-700",
              darkColor: "dark:from-green-600 dark:to-green-700",
              darkHoverColor: "dark:from-green-700 dark:to-green-800",
              onClick: handleGenerateReport 
            },
            { 
              name: "Manage Timetable", 
              icon: <Calendar className="h-6 w-6" />, 
              description: "Schedule classes",
              color: "from-purple-500 to-purple-600", 
              hoverColor: "from-purple-600 to-purple-700",
              darkColor: "dark:from-purple-600 dark:to-purple-700",
              darkHoverColor: "dark:from-purple-700 dark:to-purple-800",
              onClick: () => router.push("/dashboard/admin/timetable") 
            },
            { 
              name: "Settings", 
              icon: <Settings className="h-6 w-6" />, 
              description: "Configure system",
              color: "from-amber-500 to-amber-600", 
              hoverColor: "from-amber-600 to-amber-700",
              darkColor: "dark:from-amber-600 dark:to-amber-700",
              darkHoverColor: "dark:from-amber-700 dark:to-amber-800",
              onClick: () => router.push("/settings") 
            },
          ].map((action, i) => (
            <motion.div
              key={i}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.97 }}
            >
              <Button 
                className={`h-28 w-full text-white font-medium bg-gradient-to-br ${action.color} ${action.darkColor} hover:bg-gradient-to-br hover:${action.hoverColor} hover:${action.darkHoverColor} shadow-md flex flex-col items-center justify-center gap-2 p-2 rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300`}
                onClick={action.onClick}
              >
                <div className="bg-white/20 p-3 rounded-lg mb-1">
                  {action.icon}
                </div>
                <span className="text-white font-semibold">{action.name}</span>
                <span className="text-white/80 text-xs">{action.description}</span>
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Stats Section */}
        <motion.div 
          variants={itemVariants}
          whileInView={{ 
            opacity: [0, 1],
            y: [20, 0]
          }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <DashboardStats />
        </motion.div>

        {/* Today's Attendance Table */}
        <motion.div 
          variants={itemVariants}
          whileInView={{ 
            opacity: [0, 1],
            y: [20, 0]
          }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <AttendanceSummary />
        </motion.div>

        {/* Calendar Events */}
        <motion.div 
          variants={itemVariants}
          whileInView={{ 
            opacity: [0, 1],
            y: [20, 0]
          }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Card className="border shadow-md overflow-hidden dark:border-border">
            <CardHeader className="bg-gradient-to-r from-purple-100/50 to-background dark:from-purple-950/20 dark:to-background">
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-purple-500 dark:text-purple-400" />
                School Events Calendar
              </CardTitle>
              <CardDescription>
                Manage and organize school events and activities
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <AdminEventsManagement />
            </CardContent>
          </Card>
        </motion.div>

        {/* Back to top button */}
        <motion.div 
          className="fixed bottom-6 right-6"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: scrollY.get() > 300 ? 1 : 0,
            scale: scrollY.get() > 300 ? 1 : 0,
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button 
            className="rounded-full h-14 w-14 bg-gradient-to-br from-primary to-primary-foreground/30 dark:from-primary dark:to-primary-dark/70 shadow-lg flex items-center justify-center border border-white/20 backdrop-blur-sm transition-all duration-300"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ChevronsUp className="h-6 w-6" />
          </Button>
        </motion.div>
      </motion.div>
    </>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[180px] w-full rounded-xl" />
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-[80px] w-full rounded-xl" />
        ))}
      </div>

      <Skeleton className="h-[300px] w-full rounded-xl" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>

      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  )
}
