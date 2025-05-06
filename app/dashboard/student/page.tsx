"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, FileText, GraduationCap, User, BookOpen, Bell, TrendingUp } from "lucide-react"
import { StudentAttendance } from "@/components/student-attendance"
import { StudentResults } from "@/components/student-results"
import { StudentFees } from "@/components/student-fees"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

export default function StudentDashboard() {
  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const user = JSON.parse(userStr)
      setStudent(user)
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-2xl font-bold">Session Expired</h1>
        <p className="text-muted-foreground">Please log in again to access your dashboard</p>
        <Button onClick={() => router.push("/login")}>Go to Login</Button>
      </div>
    )
  }

  // Dummy student data
  const studentData = {
    id: student.id === "student1" ? "1035" : "1036",
    name: student.name,
    class: student.class,
    rollNo: student.id === "student1" ? "05" : "12",
    fatherName: student.id === "student1" ? "Muhammad Yameen" : "Imran Khan",
    attendancePercentage: student.id === "student1" ? 94 : 88,
    feesStatus: student.id === "student1" ? "Paid" : "Pending",
    examResult: student.id === "student1" ? "A+" : "B+",
    profileImage: student.id === "student1" ? "/student1.jpg" : "/student2.jpg",
    completedAssignments: student.id === "student1" ? 8 : 7,
    totalAssignments: 10,
    upcomingExams: [
      { subject: "Mathematics", date: "May 15, 2024" },
      { subject: "Science", date: "May 17, 2024" },
      { subject: "English", date: "May 20, 2024" },
    ]
  }

  const handleNavigate = (path: string) => {
    router.push(path)
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white">
              <AvatarImage src={studentData.profileImage} alt={studentData.name} />
              <AvatarFallback className="text-lg">{studentData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">Welcome, {studentData.name}</h1>
              <p className="text-blue-100">Student ID: {studentData.id} | Class {studentData.class} | Roll No: {studentData.rollNo}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20" onClick={() => handleNavigate("/dashboard/student/profile")}>
              View Profile
            </Button>
            <Button className="bg-white text-blue-700 hover:bg-blue-50" onClick={() => handleNavigate("/dashboard/student/fee")}>
              Pay Fees
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-all">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3">
              <User className="h-6 w-6 text-blue-700" />
            </div>
            <div onClick={() => handleNavigate("/dashboard/student/attendance")}>
              <p className="text-sm font-medium text-muted-foreground">Attendance</p>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold">{studentData.attendancePercentage}%</p>
                <p className="text-xs text-green-600">+2% from last month</p>
              </div>
              <Progress value={studentData.attendancePercentage} className="h-1 mt-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="rounded-full bg-green-100 p-3">
              <Clock className="h-6 w-6 text-green-700" />
            </div>
            <div onClick={() => handleNavigate("/dashboard/student/fee")}>
              <p className="text-sm font-medium text-muted-foreground">Fees Status</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{studentData.feesStatus}</p>
                <Badge
                  variant="outline"
                  className={
                    studentData.feesStatus === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {studentData.feesStatus === "Paid" ? "Up to date" : "Action needed"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2"  >
                {studentData.feesStatus === "Paid" 
                  ? "Next payment: May 5, 2024" 
                  : "Due date: April 30, 2024"}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="rounded-full bg-purple-100 p-3">
              <GraduationCap className="h-6 w-6 text-purple-700" />
            </div>
            <div onClick={() => handleNavigate("/dashboard/student/result")}>
              <p className="text-sm font-medium text-muted-foreground">Last Result</p>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold">{studentData.examResult}</p>
                <p className="text-xs text-purple-600">Mid-Term Exam</p>
              </div>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <TrendingUp key={star} className="h-3 w-3 text-purple-500" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="rounded-full bg-amber-100 p-3">
              <BookOpen className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Assignments</p>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold">{studentData.completedAssignments}/{studentData.totalAssignments}</p>
                <p className="text-xs text-amber-600">Completed</p>
              </div>
              <Progress 
                value={(studentData.completedAssignments / studentData.totalAssignments) * 100} 
                className="h-1 mt-2" 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="quick-access" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-4">
          <TabsTrigger value="quick-access">Quick Access</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="quick-access">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button
              className="h-24 flex flex-col items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700"
              variant="outline"
              onClick={() => router.push("/dashboard/student/timetable")}
            >
              <Calendar className="h-6 w-6" />
              <span>Class Timetable</span>
            </Button>
            <Button
              className="h-24 flex flex-col items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700"
              variant="outline"
              onClick={() => router.push("/dashboard/student/assignments")}
            >
              <FileText className="h-6 w-6" />
              <span>Assignments</span>
            </Button>
            <Button
              className="h-24 flex flex-col items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700"
              variant="outline"
              onClick={() => router.push("/dashboard/student/exams")}
            >
              <GraduationCap className="h-6 w-6" />
              <span>Exam Schedule</span>
            </Button>
            <Button
              className="h-24 flex flex-col items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700"
              variant="outline"
              onClick={() => handleNavigate("/dashboard/student/id-card")}
            >
              <User className="h-6 w-6" />
              <span>Download ID Card</span>
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentData.upcomingExams.map((exam, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-indigo-100 p-2">
                        <GraduationCap className="h-4 w-4 text-indigo-700" />
                      </div>
                      <span className="font-medium">{exam.subject}</span>
                    </div>
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
                      {exam.date}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <Bell className="h-5 w-5 text-blue-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">New Assignment Posted</p>
                    <p className="text-sm text-blue-700">Mathematics: Chapter 5 Problems</p>
                    <p className="text-xs text-blue-600 mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                  <Bell className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Results Published</p>
                    <p className="text-sm text-green-700">Science Quiz Results Available</p>
                    <p className="text-xs text-green-600 mt-1">Yesterday</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 rounded-lg bg-purple-50 border border-purple-100">
                  <Bell className="h-5 w-5 text-purple-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-purple-900">PTM Scheduled</p>
                    <p className="text-sm text-purple-700">Parent Teacher Meeting on May 10th</p>
                    <p className="text-xs text-purple-600 mt-1">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <StudentAttendance studentId={studentData.id} />
      <StudentResults studentId={studentData.id} />
      <StudentFees studentId={studentData.id} />
    </div>
  )
}
