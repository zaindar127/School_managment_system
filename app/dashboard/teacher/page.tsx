"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TeacherAttendanceTracker } from "@/components/teacher-attendance-tracker"
import { TeacherUpcomingEvents } from "@/components/teacher-upcoming-events"
import { TeacherStudentsList } from "@/components/teacher-students-list"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, BellRing, Users, Award, ChevronRight, GraduationCap, Calendar, LineChart, Clock, CheckCircle2, FileText, FileImage } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function TeacherDashboard() {
  const router = useRouter()
  const [teacher, setTeacher] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        const user = JSON.parse(userStr)
        setTeacher(user)
        
        // Only show welcome animation if not seen before in this session
        const hasSeenWelcome = sessionStorage.getItem("teacherWelcomeSeen")
        if (!hasSeenWelcome) {
          setShowWelcome(true)
          sessionStorage.setItem("teacherWelcomeSeen", "true")
          
          // Hide welcome animation after 3 seconds
          setTimeout(() => {
            setShowWelcome(false)
          }, 3000)
        }
      }
      setLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!teacher) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <Card className="w-full max-w-md p-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl">No Teacher Data Found</CardTitle>
            <CardDescription className="text-center">
              Please log in again to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button 
              onClick={() => router.push("/login")}
              className="w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
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

  const floatVariants = {
    initial: { y: 0 },
    float: {
      y: [-5, 5, -5],
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      }
    }
  }

  // Get time of day for greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const cards = [
    {
      title: "Students",
      description: "View and manage your students",
      icon: <Users className="h-6 w-6 text-blue-600" />,
      onClick: () => router.push("/dashboard/teacher/students")
    },
    {
      title: "Results",
      description: "View and manage student results",
      icon: <FileText className="h-6 w-6 text-purple-600" />,
      onClick: () => router.push("/dashboard/teacher/results")
    },
    {
      title: "Books",
      description: "View assigned books and subjects",
      icon: <BookOpen className="h-6 w-6 text-green-600" />,
      onClick: () => router.push("/dashboard/teacher/books")
    },
    {
      title: "Class Notes",
      description: "Access teaching resources and notes",
      icon: <FileImage className="h-6 w-6 text-amber-600" />,
      onClick: () => router.push("/dashboard/teacher/notes")
    }
  ]

  return (
    <>
      {/* Welcome overlay animation */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            className="fixed inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 z-50 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.5, ease: "easeOut" } 
            }}
          >
            <motion.div 
              className="text-center text-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                transition: { delay: 0.2, duration: 0.4 } 
              }}
              exit={{ 
                scale: 1.2, 
                opacity: 0,
                transition: { duration: 0.3 } 
              }}
            >
              <motion.div 
                className="mb-4 p-4 bg-white/10 rounded-full inline-block"
                animate={{ 
                  rotate: [0, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: 1, 
                }}
              >
                <GraduationCap className="h-16 w-16" />
              </motion.div>
              <h1 className="text-4xl font-bold mb-2">{getTimeBasedGreeting()}, {teacher.name}</h1>
              <p className="text-xl opacity-80">Welcome to your teaching dashboard</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    
      <motion.div 
        className="space-y-6 pb-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          variants={itemVariants} 
          className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-8 shadow-lg"
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
              <BookOpen className="h-48 w-48" />
            </motion.div>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <Badge className="bg-white/20 text-white hover:bg-white/30 px-3 py-1">
                <Clock className="h-3 w-3 mr-1" /> {new Date().toLocaleDateString()}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                {getTimeBasedGreeting()}, {teacher.name}
              </h1>
              <p className="text-indigo-100">Let's inspire your students today!</p>
            </div>
            
            <Card className="w-full md:w-auto bg-white/10 backdrop-blur-sm border-0 shadow-md text-white">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <motion.div 
                    className="flex items-center gap-3"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="p-3 bg-white/20 rounded-full">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-indigo-100">Assigned Class</p>
                      <p className="text-xl font-bold">Class {teacher.class}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-3"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    onClick={() => router.push("/dashboard/teacher/students")}
                  >
                    <div className="p-3 bg-white/20 rounded-full">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-indigo-100">Total Students</p>
                      <p className="text-xl font-bold">{teacher.class === "Two" ? 25 : 30}</p>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Navigation Cards Section */}
        <motion.div
          className="px-4 md:px-6 space-y-6"
          variants={containerVariants}
        >
          <h2 className="text-2xl font-semibold tracking-tight">Quick Navigation</h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => (
              <motion.div key={card.title} variants={itemVariants}>
                <Card 
                  className="hover:shadow-lg transition-shadow duration-200 cursor-pointer h-[140px] flex flex-col group"
                  onClick={card.onClick}
                >
                  <CardHeader className="flex-1 flex flex-col justify-center p-4 md:p-6">
                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors">
                        {card.icon}
                      </div>
                      {card.title}
                    </CardTitle>
                    <CardDescription className="text-sm mt-1.5">{card.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Events and Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <motion.div 
            variants={itemVariants}
            whileInView={{ 
              opacity: [0, 1],
              y: [20, 0]
            }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <TeacherUpcomingEvents />
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            whileInView={{ 
              opacity: [0, 1],
              y: [20, 0]
            }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Card className="h-full border overflow-hidden bg-card text-card-foreground shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BellRing className="h-5 w-5 text-indigo-600" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common tasks for teachers</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
                <motion.div
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    className="h-28 w-full text-white font-medium bg-gradient-to-br from-blue-500 to-blue-600 hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 shadow-md flex flex-col items-center justify-center gap-2 p-2 rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300"
                    onClick={() => router.push("/dashboard/teacher/attendance")}
                  >
                    <div className="bg-white/20 p-3 rounded-lg mb-1">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <span className="text-white font-semibold">Mark Attendance</span>
                    <span className="text-white/80 text-xs">For Class {teacher.class}</span>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    className="h-28 w-full text-white font-medium bg-gradient-to-br from-green-500 to-green-600 hover:bg-gradient-to-br hover:from-green-600 hover:to-green-700 shadow-md flex flex-col items-center justify-center gap-2 p-2 rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300"
                    onClick={() => router.push("/dashboard/teacher/results")}
                  >
                    <div className="bg-white/20 p-3 rounded-lg mb-1">
                      <Award className="h-6 w-6" />
                    </div>
                    <span className="text-white font-semibold">Enter Results</span>
                    <span className="text-white/80 text-xs">For Class {teacher.class}</span>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    className="h-28 w-full text-white font-medium bg-gradient-to-br from-purple-500 to-purple-600 hover:bg-gradient-to-br hover:from-purple-600 hover:to-purple-700 shadow-md flex flex-col items-center justify-center gap-2 p-2 rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300"
                    onClick={() => router.push("/reports")}
                  >
                    <div className="bg-white/20 p-3 rounded-lg mb-1">
                      <LineChart className="h-6 w-6" />
                    </div>
                    <span className="text-white font-semibold">Generate Reports</span>
                    <span className="text-white/80 text-xs">Class reports</span>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    className="h-28 w-full text-white font-medium bg-gradient-to-br from-amber-500 to-amber-600 hover:bg-gradient-to-br hover:from-amber-600 hover:to-amber-700 shadow-md flex flex-col items-center justify-center gap-2 p-2 rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300"
                    onClick={() => router.push("/dashboard/teacher/students")}
                  >
                    <div className="bg-white/20 p-3 rounded-lg mb-1">
                      <Users className="h-6 w-6" />
                    </div>
                    <span className="text-white font-semibold">View Students</span>
                    <span className="text-white/80 text-xs">Class roster</span>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Skeleton className="h-10 w-[250px] mb-2 bg-white/20" />
            <Skeleton className="h-4 w-[180px] bg-white/20" />
          </div>
          <Skeleton className="h-20 w-full md:w-[300px] bg-white/20" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-[140px] w-full rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>

      <Skeleton className="h-[400px] w-full rounded-xl" />
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  )
}
