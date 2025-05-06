"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Wallet, GraduationCap, TrendingUp, TrendingDown } from "lucide-react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function DashboardStats() {
  // Animation states for progress bars
  const [studentsProgress, setStudentsProgress] = useState(0)
  const [staffProgress, setStaffProgress] = useState(0)
  const [attendanceProgress, setAttendanceProgress] = useState(0)
  const [feeProgress, setFeeProgress] = useState(0)
  
  // Stats data
  const stats = [
    {
      title: "Total Students",
      value: 1245,
      icon: Users,
      change: "+15%",
      trend: "up",
      description: "from last month",
      progress: 75,
      color: "blue"
    },
    {
      title: "Staff Members",
      value: 42,
      icon: GraduationCap,
      change: "+2",
      trend: "up",
      description: "new this month",
      progress: 65,
      color: "purple"
    },
    {
      title: "Attendance Rate",
      value: "92.5%",
      icon: UserCheck,
      change: "+2.5%",
      trend: "up",
      description: "from last week",
      progress: 92.5,
      color: "green"
    },
    {
      title: "Fee Collection",
      value: "PKR 245,000",
      icon: Wallet,
      change: "85%",
      trend: "neutral",
      description: "of total due",
      progress: 85,
      color: "amber"
    },
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setStudentsProgress(stats[0].progress)
      setStaffProgress(stats[1].progress)
      setAttendanceProgress(stats[2].progress)
      setFeeProgress(stats[3].progress)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  const getColorClass = (color: string) => {
    switch (color) {
      case "blue": return "from-blue-500 to-blue-600"
      case "purple": return "from-purple-500 to-purple-600"
      case "green": return "from-green-500 to-green-600"
      case "amber": return "from-amber-500 to-amber-600"
      default: return "from-primary to-primary-foreground"
    }
  }

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />
    return null
  }

  return (
    <TooltipProvider>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="group"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="overflow-hidden border hover:shadow-md transition-all duration-200">
                  <div className={`h-2 bg-gradient-to-r ${getColorClass(stat.color)}`} />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <div className={`rounded-full p-2 bg-${stat.color}-100`}>
                      <stat.icon className={`h-4 w-4 text-${stat.color}-500`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center mt-1">
                      {getTrendIcon(stat.trend)}
                      <p className="text-xs text-muted-foreground ml-1">
                        {stat.change} {stat.description}
                      </p>
                    </div>
                    <div className="mt-3">
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${getColorClass(stat.color)}`}
                          initial={{ width: "0%" }}
                          animate={{ 
                            width: `${index === 0 ? studentsProgress : 
                                    index === 1 ? staffProgress : 
                                    index === 2 ? attendanceProgress : 
                                    feeProgress}%` 
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to view detailed {stat.title.toLowerCase()} information</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        ))}
      </div>
    </TooltipProvider>
  )
}
