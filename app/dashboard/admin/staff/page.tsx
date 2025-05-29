"use client"

import { useState, useEffect } from "react"
import { StaffList } from "@/components/staff-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Users, GraduationCap, UserCheck, Calendar, Search } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"

export default function StaffPage() {
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <StaffPageSkeleton />
  }

  return (
    <motion.div 
      className="space-y-6 py-5 px-4 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl p-8 shadow-lg"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 opacity-10">
          <motion.div 
            animate={{ 
              rotate: [0, 360],
              transition: { duration: 60, repeat: Infinity, ease: "linear" }
            }}
          >
            <Users className="h-64 w-64 -mt-20 -mr-20" />
          </motion.div>
        </div>
        
        <div className="relative z-10">
          <Badge className="bg-white/20 text-white hover:bg-white/30 px-3 py-1 mb-3">
            Staff Management
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Staff Information
          </h1>
          <p className="text-indigo-100 max-w-2xl">
            View and manage your school staff members. Add new teachers and staff, update information, and more.
          </p>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <StaffStatCard 
          title="Total Staff"
          value="24"
          description="Active members"
          icon={Users}
          color="purple"
        />
        <StaffStatCard 
          title="Teachers"
          value="16"
          description="Subject specialists"
          icon={GraduationCap}
          color="blue"
        />
        <StaffStatCard 
          title="Attendance"
          value="92%"
          description="Last 30 days"
          icon={UserCheck}
          color="green"
        />
        <StaffStatCard 
          title="Experience"
          value="5+ yrs"
          description="Average experience"
          icon={Calendar}
          color="amber"
        />
      </motion.div>

      {/* Actions Bar */}
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search staff members..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link href="/dashboard/admin/staff/new">
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Staff Member
          </Button>
        </Link>
      </motion.div>

      <StaffList searchQuery={searchQuery} filterRole="all" />
    </motion.div>
  )
}

function StaffStatCard({ title, value, description, icon: Icon, color }: any) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 shadow-blue-200/50",
    green: "from-green-500 to-green-600 shadow-green-200/50",
    amber: "from-amber-500 to-amber-600 shadow-amber-200/50",
    purple: "from-purple-500 to-purple-600 shadow-purple-200/50",
  }
  
  return (
    <Card className="border-none shadow-lg overflow-hidden">
      <CardContent className={`p-0 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]}`}>
        <div className="flex items-center gap-4 p-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/80">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-white/70">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StaffPageSkeleton() {
  return (
    <div className="space-y-6 py-5 px-4">
      <Skeleton className="h-[160px] w-full rounded-xl bg-gradient-to-r from-purple-400/70 to-indigo-400/70" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-[100px] w-full rounded-xl" />
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-10 w-[140px]" />
      </div>
      
      <Skeleton className="h-10 w-[300px] mb-4" />
      <Skeleton className="h-[500px] w-full rounded-xl" />
    </div>
  )
}
