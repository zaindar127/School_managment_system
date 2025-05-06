"use client"

import { useState, useEffect } from "react"
import { StudentsList } from "@/components/students-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Users, GraduationCap, Award, BookOpen, Search, School } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StudentsPage() {
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [classFilter, setClassFilter] = useState("all")

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <StudentsPageSkeleton />
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
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 shadow-lg"
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
            <School className="h-64 w-64 -mt-20 -mr-20" />
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 opacity-10 -mb-8 -ml-8">
          <motion.div 
            animate={{ 
              rotate: [0, -360],
              transition: { duration: 80, repeat: Infinity, ease: "linear" }
            }}
          >
            <BookOpen className="h-48 w-48" />
          </motion.div>
        </div>
        
        <div className="relative z-10">
          <Badge className="bg-white/20 text-white hover:bg-white/30 px-3 py-1 mb-3">
            Student Management
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Students Information
          </h1>
          <p className="text-blue-100 max-w-2xl">
            Manage your students' records, view academic progress, and track enrollment data across all classes.
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
        <StudentStatCard 
          title="Total Students"
          value="235"
          description="Currently enrolled"
          icon={Users}
          color="blue"
        />
        <StudentStatCard 
          title="Classes"
          value="12"
          description="From Nursery to 10th"
          icon={GraduationCap}
          color="indigo"
        />
        <StudentStatCard 
          title="Top Performers"
          value="42"
          description="A+ students"
          icon={Award}
          color="green"
        />
        <StudentStatCard 
          title="New Admissions"
          value="15"
          description="This month"
          icon={PlusCircle}
          color="amber"
        />
      </motion.div>

      {/* Filters Bar */}
      <motion.div 
        className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search students by name, ID, or class..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select
          value={classFilter}
          onValueChange={setClassFilter}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            <SelectItem value="nursery">Nursery</SelectItem>
            <SelectItem value="prep">Prep</SelectItem>
            <SelectItem value="one">Class One</SelectItem>
            <SelectItem value="two">Class Two</SelectItem>
            <SelectItem value="three">Class Three</SelectItem>
            <SelectItem value="four">Class Four</SelectItem>
            <SelectItem value="five">Class Five</SelectItem>
          </SelectContent>
        </Select>
        
        <Link href="/dashboard/admin/students/admission">
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Admission
          </Button>
        </Link>
      </motion.div>

      {/* Student List with Tabs */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-950 rounded-lg shadow-sm border"
      >
        <Tabs defaultValue="all" className="w-full">
          <div className="border-b">
            <TabsList className="p-2 bg-transparent">
              <TabsTrigger value="all">All Students</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="new">New Admissions</TabsTrigger>
              <TabsTrigger value="graduated">Graduated</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-0 p-4">
            <StudentsList />
          </TabsContent>
          
          <TabsContent value="active" className="mt-0 p-4">
            <StudentsList />
          </TabsContent>
          
          <TabsContent value="new" className="mt-0 p-4">
            <StudentsList />
          </TabsContent>
          
          <TabsContent value="graduated" className="mt-0 p-4">
            <StudentsList />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}

function StudentStatCard({ title, value, description, icon: Icon, color }: any) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 shadow-blue-200/50",
    indigo: "from-indigo-500 to-indigo-600 shadow-indigo-200/50",
    green: "from-green-500 to-green-600 shadow-green-200/50",
    amber: "from-amber-500 to-amber-600 shadow-amber-200/50",
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

function StudentsPageSkeleton() {
  return (
    <div className="space-y-6 py-5 px-4">
      <Skeleton className="h-[160px] w-full rounded-xl bg-gradient-to-r from-blue-400/70 to-indigo-400/70" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-[100px] w-full rounded-xl" />
        ))}
      </div>
      
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <Skeleton className="h-10 w-full flex-1" />
        <Skeleton className="h-10 w-[180px]" />
        <Skeleton className="h-10 w-[140px]" />
      </div>
      
      <Skeleton className="h-12 w-full rounded-t-xl" />
      <Skeleton className="h-[500px] w-full rounded-b-xl" />
    </div>
  )
}
