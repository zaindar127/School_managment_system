"use client"

import { useState, useEffect } from "react"
import { FeeManagement } from "@/components/fee-management"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { DollarSign, CreditCard, Calculator, Receipt, Percent } from "lucide-react"

export default function FeesPage() {
  const [loading, setLoading] = useState(true)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <FeesPageSkeleton />
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
        className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl p-8 shadow-lg"
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
            <DollarSign className="h-64 w-64 -mt-20 -mr-20" />
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 opacity-10 -mb-8 -ml-8">
          <motion.div 
            animate={{ 
              rotate: [0, -360],
              transition: { duration: 80, repeat: Infinity, ease: "linear" }
            }}
          >
            <Receipt className="h-48 w-48" />
          </motion.div>
        </div>
        
        <div className="relative z-10">
          <Badge className="bg-white/20 text-white hover:bg-white/30 px-3 py-1 mb-3">
            Financial Management
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Fee Management
          </h1>
          <p className="text-emerald-100 max-w-2xl">
            Manage student fees, create fee structures, track payments, and generate financial reports for your institution.
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
        <FeeStatCard 
          title="Total Collection"
          value="₹152,500"
          description="Current month"
          icon={DollarSign}
          color="emerald"
        />
        <FeeStatCard 
          title="Pending Dues"
          value="₹42,000"
          description="15 students"
          icon={Calculator}
          color="amber"
        />
        <FeeStatCard 
          title="Payment Rate"
          value="85%"
          description="Overall collection"
          icon={Percent}
          color="blue"
        />
        <FeeStatCard 
          title="Online Payments"
          value="₹95,000"
          description="62% of total"
          icon={CreditCard}
          color="purple"
        />
      </motion.div>

      {/* Fee Management Component */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <FeeManagement />
      </motion.div>
    </motion.div>
  )
}

function FeeStatCard({ title, value, description, icon: Icon, color }: any) {
  const colorClasses = {
    emerald: "from-emerald-500 to-emerald-600 shadow-emerald-200/50",
    blue: "from-blue-500 to-blue-600 shadow-blue-200/50",
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

function FeesPageSkeleton() {
  return (
    <div className="space-y-6 py-5 px-4">
      <Skeleton className="h-[160px] w-full rounded-xl bg-gradient-to-r from-emerald-400/70 to-teal-400/70" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-[100px] w-full rounded-xl" />
        ))}
      </div>
      
      <Skeleton className="h-[600px] w-full rounded-xl" />
    </div>
  )
}
