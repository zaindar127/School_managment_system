"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle, Clock, Search, Users, XCircle, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function TeacherAttendancePage() {
  const [teacher, setTeacher] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [attendanceData, setAttendanceData] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  // Load teacher data
  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const user = JSON.parse(userStr)
      setTeacher(user)
      
      // Simulate loading students data based on teacher's class
      setTimeout(() => {
        // Mock data - in a real app, this would come from an API
        const studentsData = user.class === "Two" 
          ? generateMockStudentsData(25, "Two")
          : generateMockStudentsData(30, user.class)
          
        setAttendanceData(studentsData)
        setLoading(false)
      }, 800)
    } else {
      setLoading(false)
    }
  }, [])

  // Generate mock data
  const generateMockStudentsData = (count: number, className: string) => {
    const names = [
      "Ahmed Khan", "Sara Ali", "Bilal Ahmed", "Fatima Malik", "Hassan Abbas",
      "Ayesha Tariq", "Zainab Noor", "Muhammad Usman", "Amina Raza", "Ali Akbar",
      "Mariam Aziz", "Imran Sheikh", "Sana Khalid", "Omar Farooq", "Hira Nadeem",
      "Yusuf Raza", "Nadia Hussain", "Saad Mehmood", "Farah Kamal", "Ibrahim Qureshi",
      "Zara Malik", "Hamza Khan", "Samia Iqbal", "Danial Ahmed", "Aisha Baig",
      "Umar Ali", "Sadia Shah", "Faisal Abbasi", "Rabia Zafar", "Tariq Mahmood"
    ]
    
    return Array(count).fill(0).map((_, i) => ({
      id: `STD${className}${(i + 1).toString().padStart(2, '0')}`,
      name: names[i % names.length],
      rollNo: (i + 1).toString().padStart(2, '0'),
      avatar: `/student${i % 5 + 1}.jpg`,
      class: className,
      status: Math.random() > 0.15 ? "present" : "absent",
      lastUpdated: new Date().toISOString()
    }))
  }
  
  if (!teacher) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <Card className="w-full max-w-md p-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Authentication Required</CardTitle>
            <CardDescription className="text-center">
              Please log in to access the attendance page
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
  
  // Filter students based on search query
  const filteredStudents = attendanceData.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNo.includes(searchQuery)
  )
  
  // Mark all as present
  const markAllPresent = () => {
    setAttendanceData(prev => 
      prev.map(student => ({
        ...student,
        status: "present",
        lastUpdated: new Date().toISOString()
      }))
    )
    toast.success("All students marked present")
  }
  
  // Toggle attendance status for a student
  const toggleAttendance = (studentId: string) => {
    setAttendanceData(prev => 
      prev.map(student => 
        student.id === studentId 
          ? {
              ...student,
              status: student.status === "present" ? "absent" : "present",
              lastUpdated: new Date().toISOString()
            }
          : student
      )
    )
  }
  
  // Save attendance
  const saveAttendance = () => {
    setSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      toast.success("Attendance saved successfully")
    }, 1000)
  }
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return <AttendancePageSkeleton />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Class {teacher.class} Attendance</h1>

      <motion.div 
        className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-8 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 right-0 opacity-10">
          <motion.div 
            animate={{ 
              rotate: [0, 360],
              transition: { duration: 60, repeat: Infinity, ease: "linear" }
            }}
          >
            <Calendar className="h-64 w-64 -mt-20 -mr-20" />
          </motion.div>
        </div>
        
        <div className="relative z-10">
          <Badge className="bg-white/20 text-white hover:bg-white/30 px-3 py-1 mb-3">
            <Clock className="h-3 w-3 mr-1" /> {formatDate(selectedDate)}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Class {teacher.class} Attendance
          </h1>
          <p className="text-indigo-100 max-w-2xl">
            Mark attendance for all students in your class. Changes are saved automatically when you toggle each student's status.
          </p>
        </div>
      </motion.div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg">
          <Users className="h-5 w-5 text-indigo-600" />
          <span className="font-medium text-indigo-700">Total Students: {attendanceData.length}</span>
          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs ml-2">
            {attendanceData.filter(s => s.status === "present").length} Present
          </span>
          <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs ml-1">
            {attendanceData.filter(s => s.status === "absent").length} Absent
          </span>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              type="text" 
              placeholder="Search students..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button 
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
            onClick={markAllPresent}
          >
            <CheckCircle className="mr-2 h-4 w-4" /> Mark All Present
          </Button>
          
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={saveAttendance}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Attendance"}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="w-full max-w-md mb-6">
          <TabsTrigger value="list" className="flex-1">List View</TabsTrigger>
          <TabsTrigger value="grid" className="flex-1">Grid View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="bg-muted/50 p-4 grid grid-cols-12 gap-4 font-medium">
                  <div className="col-span-1 flex justify-center">#</div>
                  <div className="col-span-5">Student Name</div>
                  <div className="col-span-2">Roll No</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2 text-right">Action</div>
                </div>
                
                {filteredStudents.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No students found matching your search
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredStudents.map((student, index) => (
                      <motion.div 
                        key={student.id}
                        className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-muted/50 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03, duration: 0.3 }}
                      >
                        <div className="col-span-1 flex justify-center font-medium text-muted-foreground">
                          {index + 1}
                        </div>
                        <div className="col-span-5 flex items-center gap-3">
                          <Avatar className="h-8 w-8 border">
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.id}</p>
                          </div>
                        </div>
                        <div className="col-span-2">{student.rollNo}</div>
                        <div className="col-span-2">
                          <Badge 
                            className={
                              student.status === "present" 
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            }
                          >
                            {student.status === "present" ? "Present" : "Absent"}
                          </Badge>
                        </div>
                        <div className="col-span-2 flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className={
                              student.status === "present"
                                ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                                : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                            }
                            onClick={() => toggleAttendance(student.id)}
                          >
                            {student.status === "present" ? (
                              <>
                                <XCircle className="mr-1 h-3.5 w-3.5" />
                                Mark Absent
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-1 h-3.5 w-3.5" />
                                Mark Present
                              </>
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="grid" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
              >
                <Card className={`border ${
                  student.status === "present" 
                    ? "border-green-200 bg-green-50/50" 
                    : "border-red-200 bg-red-50/50"
                } overflow-hidden transition-colors duration-300`}>
                  <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle className="text-base font-medium">{student.name}</CardTitle>
                      <CardDescription>Roll No: {student.rollNo}</CardDescription>
                    </div>
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 flex items-center justify-between">
                    <Badge 
                      className={
                        student.status === "present" 
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {student.status === "present" ? "Present" : "Absent"}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className={
                        student.status === "present"
                          ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                          : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                      }
                      onClick={() => toggleAttendance(student.id)}
                    >
                      {student.status === "present" ? "Mark Absent" : "Mark Present"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AttendancePageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[160px] w-full rounded-xl bg-gradient-to-r from-indigo-400/70 to-purple-400/70" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <Skeleton className="h-10 w-[200px]" />
        <div className="flex gap-3 w-full md:w-auto">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[140px]" />
          <Skeleton className="h-10 w-[140px]" />
        </div>
      </div>
      
      <Skeleton className="h-10 w-[200px] mb-6" />
      
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        {Array(8).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  )
} 