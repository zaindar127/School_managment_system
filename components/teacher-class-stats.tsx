"use client"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserX, Award, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function TeacherClassStats({ className }: { className: string }) {
  // Dummy data for class statistics
  const stats = {
    totalStudents: className === "Two" ? 25 : 30,
    presentToday: className === "Two" ? 22 : 26,
    absentToday: className === "Two" ? 3 : 4,
    topPerformers: className === "Two" ? 8 : 10,
  }

  const [presentProgress, setPresentProgress] = useState(0)
  const [topProgress, setTopProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPresentProgress(Math.round((stats.presentToday / stats.totalStudents) * 100))
      setTopProgress(Math.round((stats.topPerformers / stats.totalStudents) * 100))
    }, 500)
    
    return () => clearTimeout(timer)
  }, [stats.presentToday, stats.totalStudents, stats.topPerformers])

  const fadeInUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={fadeInUp} whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
          <Card className="border-l-4 border-l-primary border-t-0 border-r-0 border-b-0 shadow-md hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg mb-1">Total Students</CardTitle>
              <p className="text-3xl font-bold text-primary">{stats.totalStudents}</p>
              <p className="text-xs text-muted-foreground mt-2">Class {className}</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={fadeInUp} whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="border-l-4 border-l-green-500 border-t-0 border-r-0 border-b-0 shadow-md hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-green-500/10 p-3 mb-3">
                    <UserCheck className="h-6 w-6 text-green-500" />
                  </div>
                  <CardTitle className="text-lg mb-1">Present Today</CardTitle>
                  <p className="text-3xl font-bold text-green-500">{stats.presentToday}</p>
                  <div className="w-full mt-3">
                    <div className="h-2 w-full bg-green-100 rounded-full overflow-hidden">
                      <Progress value={presentProgress} className={cn("h-full bg-green-500")} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {presentProgress}% attendance
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to view detailed attendance records</p>
            </TooltipContent>
          </Tooltip>
        </motion.div>
        
        <motion.div variants={fadeInUp} whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
          <Card className="border-l-4 border-l-red-500 border-t-0 border-r-0 border-b-0 shadow-md hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-red-500/10 p-3 mb-3">
                <UserX className="h-6 w-6 text-red-500" />
              </div>
              <CardTitle className="text-lg mb-1">Absent Today</CardTitle>
              <p className="text-3xl font-bold text-red-500">{stats.absentToday}</p>
              <div className="w-full mt-3">
                <div className="h-2 w-full bg-red-100 rounded-full overflow-hidden">
                  <Progress value={100 - presentProgress} className={cn("h-full bg-red-500")} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {100 - presentProgress}% of class
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={fadeInUp} whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="border-l-4 border-l-amber-500 border-t-0 border-r-0 border-b-0 shadow-md hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="rounded-full bg-amber-500/10 p-3 mb-3">
                    <Award className="h-6 w-6 text-amber-500" />
                  </div>
                  <CardTitle className="text-lg mb-1">Top Performers</CardTitle>
                  <p className="text-3xl font-bold text-amber-500">{stats.topPerformers}</p>
                  <div className="w-full mt-3">
                    <div className="h-2 w-full bg-amber-100 rounded-full overflow-hidden">
                      <Progress value={topProgress} className={cn("h-full bg-amber-500")} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                      <TrendingUp className="h-3 w-3" /> {topProgress}% A and A+ students
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to view top performing students</p>
            </TooltipContent>
          </Tooltip>
        </motion.div>
      </div>
    </TooltipProvider>
  )
}
