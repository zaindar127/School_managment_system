"use client"

import { useState, useEffect } from "react"
import { AdmissionForm } from "@/components/admission-form"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { GraduationCap, Users, School, PenTool, BookOpen } from "lucide-react"

export default function AdmissionPage() {
  const [loading, setLoading] = useState(true)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <AdmissionPageSkeleton />
  }

  return (
    <motion.div 
      className="space-y-6 py-5 px-4 max-w-[1200px] mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-8 shadow-lg"
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
            <GraduationCap className="h-64 w-64 -mt-20 -mr-20" />
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 opacity-10 -mb-8 -ml-8">
          <motion.div 
            animate={{ 
              rotate: [0, -360],
              transition: { duration: 80, repeat: Infinity, ease: "linear" }
            }}
          >
            <School className="h-48 w-48" />
          </motion.div>
        </div>
        
        <div className="relative z-10">
          <Badge className="bg-white/20 text-white hover:bg-white/30 px-3 py-1 mb-3">
            Enrollment Process
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Student Admission
          </h1>
          <p className="text-blue-100 max-w-2xl">
            Welcome new students to your institution by completing the admission process with all required information and documentation.
          </p>
        </div>
      </motion.div>

      {/* Admission Tips Section */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <AdmissionInfoCard 
          icon={PenTool}
          title="Complete All Fields"
          description="Ensure all required fields are filled in accurately for a smooth admission process."
        />
        <AdmissionInfoCard 
          icon={BookOpen}
          title="Required Documents"
          description="Have all student documents ready for upload, including previous academic records."
        />
        <AdmissionInfoCard 
          icon={Users}
          title="Guardian Information"
          description="Include complete parent/guardian details for emergency contact purposes."
        />
      </motion.div>

      {/* Admission Form Component */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden p-1"
      >
        <AdmissionForm />
      </motion.div>
    </motion.div>
  )
}

function AdmissionInfoCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-3 rounded-lg">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-medium text-lg mb-1">{title}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{description}</p>
        </div>
      </div>
    </div>
  )
}

function AdmissionPageSkeleton() {
  return (
    <div className="space-y-6 py-5 px-4">
      <Skeleton className="h-[160px] w-full rounded-xl bg-gradient-to-r from-blue-400/70 to-cyan-400/70" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array(3).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
        ))}
      </div>
      
      <Skeleton className="h-[600px] w-full rounded-xl" />
    </div>
  )
}
