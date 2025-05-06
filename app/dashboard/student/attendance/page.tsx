"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, UserCheck, UserX } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function StudentAttendancePage() {
  const router = useRouter()
  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  
  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      setStudent(JSON.parse(userStr))
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
        <p className="text-muted-foreground">Please log in again to view your attendance</p>
        <Button onClick={() => router.push("/login")}>Go to Login</Button>
      </div>
    )
  }

  // Generate dummy attendance data based on student ID
  const generateAttendanceData = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"]
    
    // Current month attendance records
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const currentMonthRecords = []
    
    // Seed based on student ID to make it consistent
    const seed = student.id === "student1" ? 12345 : 67890
    
    let presentCount = 0
    let absentCount = 0
    let leaveCount = 0
    
    for (let day = 1; day <= daysInMonth; day++) {
      // Skip weekends (Saturday and Sunday)
      const date = new Date(currentYear, currentMonth, day)
      if (date.getDay() === 0 || date.getDay() === 6) continue
      
      // Use a deterministic approach based on day + seed + month
      const hash = (day + seed + currentMonth) % 10
      let status
      
      if (hash < 7) {
        status = "Present"
        presentCount++
      } else if (hash < 9) {
        status = "Absent"
        absentCount++
      } else {
        status = "Leave"
        leaveCount++
      }
      
      currentMonthRecords.push({
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        day: day,
        status: status,
        markedBy: "Class Teacher"
      })
    }
    
    // Total attendance report
    const totalDays = presentCount + absentCount + leaveCount
    const attendancePercentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0
    
    return {
      month: monthNames[currentMonth],
      year: currentYear,
      attendance: currentMonthRecords,
      summary: {
        totalDays,
        presentCount,
        absentCount,
        leaveCount,
        attendancePercentage
      }
    }
  }
  
  const attendanceData = generateAttendanceData()
  
  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }
  
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-700 border-green-200"
      case "Absent":
        return "bg-red-100 text-red-700 border-red-200"
      case "Leave":
        return "bg-amber-100 text-amber-700 border-amber-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Attendance</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back to Dashboard
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance Summary Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Attendance Summary</CardTitle>
            <CardDescription>
              Overall attendance for {attendanceData.month} {attendanceData.year}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Attendance Rate</span>
                <span className="text-sm font-medium">{attendanceData.summary.attendancePercentage}%</span>
              </div>
              <Progress value={attendanceData.summary.attendancePercentage} className="h-2" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
                <UserCheck className="h-5 w-5 text-green-600 mb-1" />
                <span className="text-xl font-bold text-green-700">{attendanceData.summary.presentCount}</span>
                <span className="text-xs text-green-600">Present</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg">
                <UserX className="h-5 w-5 text-red-600 mb-1" />
                <span className="text-xl font-bold text-red-700">{attendanceData.summary.absentCount}</span>
                <span className="text-xs text-red-600">Absent</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-amber-50 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600 mb-1" />
                <span className="text-xl font-bold text-amber-700">{attendanceData.summary.leaveCount}</span>
                <span className="text-xs text-amber-600">Leave</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Attendance Records Card */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>
                Daily attendance record for the selected month
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                <span className="sr-only">Previous month</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m15 18-6-6 6-6"/></svg>
              </Button>
              <span className="text-sm font-medium">
                {attendanceData.month} {attendanceData.year}
              </span>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <span className="sr-only">Next month</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m9 18 6-6-6-6"/></svg>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="list" className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Day</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Marked By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.attendance.map((record, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-3 text-sm">{record.date}</td>
                          <td className="px-4 py-3 text-sm">{record.day}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className={getStatusColor(record.status)}>
                              {record.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">{record.markedBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="calendar">
                <div className="grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                    <div key={i} className="text-center font-medium p-2 text-sm">
                      {day}
                    </div>
                  ))}
                  
                  {/* Render calendar days */}
                  {Array.from({ length: new Date(currentYear, currentMonth, 1).getDay() }, (_, i) => (
                    <div key={`empty-${i}`} className="p-2 h-20 border border-transparent"></div>
                  ))}
                  
                  {Array.from({ length: new Date(currentYear, currentMonth + 1, 0).getDate() }, (_, i) => {
                    const day = i + 1
                    const date = new Date(currentYear, currentMonth, day)
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6
                    
                    // Find attendance record for this day
                    const record = attendanceData.attendance.find(r => parseInt(r.date.split('-')[2]) === day)
                    
                    return (
                      <div 
                        key={`day-${day}`} 
                        className={`p-2 h-20 text-sm border ${isWeekend ? 'bg-gray-50' : 'bg-white'} ${record ? 'border-gray-200' : 'border-transparent'}`}
                      >
                        <div className="font-medium">{day}</div>
                        {record && (
                          <div className={`mt-2 text-xs rounded-full px-2 py-1 inline-block ${getStatusColor(record.status)}`}>
                            {record.status}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Attendance Policy</CardTitle>
          <CardDescription>
            Students are required to maintain at least 75% attendance to be eligible for exams
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Present</h3>
              <p className="text-sm text-gray-600">
                Students who attend classes on a given day are marked as present.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Absent</h3>
              <p className="text-sm text-gray-600">
                Students who fail to attend classes without prior notice are marked as absent.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Leave</h3>
              <p className="text-sm text-gray-600">
                Students who are absent with prior permission or valid reason are marked as on leave.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
