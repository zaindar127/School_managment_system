"use client"

import { useState, useEffect } from "react"
import { VoucherManagement } from "@/components/voucher-management"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { 
  Receipt, 
  FileText, 
  PieChart, 
  FileCheck, 
  Clock 
} from "lucide-react"

export default function VouchersPage() {
  const [loading, setLoading] = useState(true)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <VouchersPageSkeleton />
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
        className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-700 rounded-xl p-8 shadow-lg"
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
            <Receipt className="h-64 w-64 -mt-20 -mr-20" />
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 opacity-10 -mb-8 -ml-8">
          <motion.div 
            animate={{ 
              rotate: [0, -360],
              transition: { duration: 80, repeat: Infinity, ease: "linear" }
            }}
          >
            <FileText className="h-48 w-48" />
          </motion.div>
        </div>
        
        <div className="relative z-10">
          <Badge className="bg-white/20 text-white hover:bg-white/30 px-3 py-1 mb-3">
            Documentation
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Voucher Management
          </h1>
          <p className="text-indigo-100 max-w-2xl">
            Create, track, and manage vouchers for various financial transactions and maintain proper documentation for your institution.
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
        <VoucherStatCard 
          title="Total Vouchers"
          value="243"
          description="Current month"
          icon={Receipt}
          color="indigo"
        />
        <VoucherStatCard 
          title="Pending Approvals"
          value="18"
          description="Require verification"
          icon={Clock}
          color="amber"
        />
        <VoucherStatCard 
          title="Approved"
          value="195"
          description="80% of total"
          icon={FileCheck}
          color="green"
        />
        <VoucherStatCard 
          title="Expenditure"
          value="₹78,500"
          description="This month"
          icon={PieChart}
          color="blue"
        />
      </motion.div>

      {/* Voucher Management Component */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        <VoucherManagement />
      </motion.div>
    </motion.div>
  )
}

function VoucherStatCard({ title, value, description, icon: Icon, color }: any) {
  const colorClasses = {
    indigo: "from-indigo-500 to-indigo-600 shadow-indigo-200/50",
    blue: "from-blue-500 to-blue-600 shadow-blue-200/50",
    amber: "from-amber-500 to-amber-600 shadow-amber-200/50",
    green: "from-emerald-500 to-emerald-600 shadow-emerald-200/50",
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

function VouchersPageSkeleton() {
  return (
    <div className="space-y-6 py-5 px-4">
      <Skeleton className="h-[160px] w-full rounded-xl bg-gradient-to-r from-indigo-400/70 to-violet-400/70" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-[100px] w-full rounded-xl" />
        ))}
      </div>
      
      <Skeleton className="h-[600px] w-full rounded-xl" />
    </div>
  )
}
