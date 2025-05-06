"use client"

import { useState, useEffect } from "react"
import { ResultsManagement } from "@/components/results-management"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Award, BookOpen, GraduationCap, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export default function ResultsPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Simulate loading and fetch user data
    const timer = setTimeout(() => {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        setUser(JSON.parse(userStr))
      }
      setLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <ResultsPageSkeleton />
  }

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

  const isTeacher = user?.role === "teacher"
  const isStudent = user?.role === "student"

  return (
    <motion.div 
      className="space-y-5 py-5 sm:py-6 px-2 sm:px-3 md:px-4 max-w-[1100px] mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        variants={itemVariants} 
        className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-8 shadow-lg"
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 opacity-10">
          <motion.div 
            animate={{ 
              rotate: [0, 360],
              transition: { duration: 60, repeat: Infinity, ease: "linear" }
            }}
          >
            <Award className="h-64 w-64 -mt-20 -mr-20" />
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
        
        <div className="relative z-10 space-y-3">
          <Badge className="bg-white/20 text-white hover:bg-white/30 px-3 py-1">
            {isTeacher ? "Teacher View" : isStudent ? "Student View" : "Admin View"}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Academic Results
          </h1>
          <p className="text-amber-100 max-w-2xl">
            {isTeacher 
              ? "Manage your class results and track student performance" 
              : isStudent 
                ? "View your academic performance and result cards"
                : "Comprehensive results management system for all classes"
            }
          </p>
        </div>
      </motion.div>

      {!isStudent && (
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          <StatCard 
            title="Top Students"
            value="15"
            description="Students with A+ grade"
            icon={GraduationCap}
            color="blue"
          />
          <StatCard 
            title="Class Average"
            value="78.5%"
            description="Overall performance"
            icon={TrendingUp}
            color="green"
          />
          <StatCard 
            title="Excellence"
            value="92%"
            description="Pass rate"
            icon={Award}
            color="amber"
          />
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <ResultsManagement />
      </motion.div>
    </motion.div>
  )
}

function StatCard({ title, value, description, icon: Icon, color }: any) {
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

function ResultsPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[160px] w-full rounded-xl bg-gradient-to-r from-amber-400/70 to-orange-400/70" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-[100px] w-full rounded-xl" />
        ))}
      </div>
      
      <Skeleton className="h-[600px] w-full rounded-xl" />
    </div>
  )
}
