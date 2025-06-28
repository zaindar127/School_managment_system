"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, DollarSign, Receipt, TrendingUp, Calculator, Users } from "lucide-react"

export default function FinancePage() {
  const router = useRouter()

  // Animation variants
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

  return (
    <motion.div
      className="space-y-6 p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Finance Management</h1>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div variants={itemVariants}>
          <Card 
            className="h-full flex flex-col justify-between hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => router.push("/dashboard/admin/fees")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-emerald-600" />
                Fee Management
              </CardTitle>
              <CardDescription>
                Manage student fees, create fee structures, track payments, and generate financial reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Total Collection: ₹152,500</span>
                <span className="text-emerald-600 font-medium">85%</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card 
            className="h-full flex flex-col justify-between hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => router.push("/dashboard/admin/vouchers")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-6 w-6 text-indigo-600" />
                Expenses & Vouchers
              </CardTitle>
              <CardDescription>
                Create, track, and manage vouchers for various financial transactions and maintain proper documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Total Expenditure: ₹78,500</span>
                <span className="text-indigo-600 font-medium">243 vouchers</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card 
            className="h-full flex flex-col justify-between hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => router.push("/dashboard/admin/staff-pay")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-purple-600" />
                Staff Payroll
              </CardTitle>
              <CardDescription>
                Manage staff salaries, process payments, track payroll history, and generate payslips
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Total Payroll: ₹125,000</span>
                <span className="text-purple-600 font-medium">12 staff</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Finance Overview Stats */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        variants={itemVariants}
      >
        <Card className="border-none shadow-lg overflow-hidden">
          <CardContent className="p-0 bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-200/50">
            <div className="flex items-center gap-4 p-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">Total Revenue</p>
                <p className="text-2xl font-bold text-white">₹152,500</p>
                <p className="text-xs text-white/70">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg overflow-hidden">
          <CardContent className="p-0 bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-200/50">
            <div className="flex items-center gap-4 p-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">Pending Dues</p>
                <p className="text-2xl font-bold text-white">₹42,000</p>
                <p className="text-xs text-white/70">15 students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg overflow-hidden">
          <CardContent className="p-0 bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-200/50">
            <div className="flex items-center gap-4 p-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">Collection Rate</p>
                <p className="text-2xl font-bold text-white">85%</p>
                <p className="text-xs text-white/70">Overall</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg overflow-hidden">
          <CardContent className="p-0 bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-indigo-200/50">
            <div className="flex items-center gap-4 p-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Receipt className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">Total Expenses</p>
                <p className="text-2xl font-bold text-white">₹78,500</p>
                <p className="text-xs text-white/70">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
} 