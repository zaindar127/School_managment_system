"use client"

import { FileBarChart, Download, FileUp, FileDown, BarChart, PieChart, GraduationCap, CreditCard, Users, Calendar, Clock, ChevronRight, CheckCircle2 } from "lucide-react"
import { ReportsManagement } from "@/components/reports-management"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [showTip, setShowTip] = useState(true)

  useEffect(() => {
    setMounted(true)
    
    // Hide the tip after 5 seconds
    const timer = setTimeout(() => {
      setShowTip(false)
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return null
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      } 
    }
  }

  const floatVariants = {
    initial: { y: 0 },
    float: {
      y: [-5, 0, -5],
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      }
    }
  }

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background decorative elements */}
      <motion.div 
        className="fixed top-0 right-0 -z-10 opacity-5 text-primary"
        animate={{ 
          rotate: [0, 360],
          transition: { duration: 60, repeat: Infinity, ease: "linear" }
        }}
      >
        <FileBarChart className="h-96 w-96 -mt-20 -mr-20" />
      </motion.div>
      
      {/* Page Header */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-r from-primary/80 to-primary rounded-xl p-6 text-white shadow-lg"
      >
        <div className="absolute inset-0 bg-[url('/dashboard-pattern.svg')] opacity-10"></div>
        {/* Floating icon animation */}
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
          <FileBarChart className="h-64 w-64" />
        </motion.div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <Badge className="bg-white/20 text-white hover:bg-white/30 px-3 py-1">
              <Clock className="h-3 w-3 mr-1" /> {new Date().toLocaleDateString()}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">Reports Dashboard</h1>
            <p className="text-primary-100">
              Generate and analyze comprehensive reports for your school
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.98 }}
            >
              <Button variant="outline" size="sm" className="h-9 bg-white/20 border-white/10 text-white hover:bg-white/30 hover:text-white">
                <FileUp className="mr-2 h-4 w-4" />
                Export All
              </Button>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.98 }}
            >
              <Button size="sm" className="h-9 bg-white/30 hover:bg-white/40 text-white">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Tip Card with animation */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="bg-amber-100 p-2 rounded-full mt-1">
                  <CheckCircle2 className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-amber-800">Pro Tip</p>
                  <p className="text-amber-700 text-sm">You can generate PDF reports that are ready to print or share with staff members and parents</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-auto text-amber-600 hover:text-amber-700 hover:bg-amber-100 -mr-2 -mt-2"
                  onClick={() => setShowTip(false)}
                >
                  Dismiss
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats with staggered animation */}
      <motion.div 
        variants={itemVariants}
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { title: "Total Students", icon: Users, value: "183", change: "+12 from last month", color: "bg-blue-50 text-blue-600" },
          { title: "Attendance Rate", icon: Calendar, value: "89.2%", change: "+2.1% from last month", color: "bg-emerald-50 text-emerald-600" },
          { title: "Fee Collection", icon: CreditCard, value: "₹283,489", change: "+₹42,938 from last month", color: "bg-purple-50 text-purple-600" },
          { title: "Staff Members", icon: GraduationCap, value: "34", change: "+2 from last month", color: "bg-amber-50 text-amber-600" }
        ].map((stat, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
            whileHover={{ 
              y: -5,
              transition: { 
                type: "spring", 
                stiffness: 400, 
                damping: 10 
              }
            }}
          >
            <Card className="border shadow-sm hover:shadow-md transition-all overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <motion.div
                  initial={{ rotate: 0 }}
                  whileHover={{ rotate: 15, scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className={`p-2 rounded-full ${stat.color.split(' ')[0]}/10`}
                >
                  <stat.icon className={`h-4 w-4 ${stat.color.split(' ')[1]}`} />
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </CardContent>
              {/* Progress indicator */}
              <div className="h-1 w-full bg-muted/30">
                <motion.div 
                  className={`h-full ${stat.color.split(' ')[0]}/70`}
                  initial={{ width: 0 }}
                  animate={{ width: `${70 + Math.random() * 30}%` }}
                  transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Report Tabs Section */}
      <motion.div variants={itemVariants}>
        <Tabs 
          defaultValue="overview" 
          className="space-y-4"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-4 mb-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity, 
                          repeatType: "reverse"
                        }}
                      >
                        <FileBarChart className="h-5 w-5 text-primary" />
                      </motion.div>
                      <CardTitle>School Reports</CardTitle>
                    </div>
                  </div>
                  <CardDescription>
                    Generate comprehensive reports for all aspects of school management
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ReportsManagement />
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
