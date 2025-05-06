"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Calendar, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { generatePDF } from "@/lib/pdf-generator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export function StudentAttendance({ studentId }: { studentId: string }) {
  // Get current user role from localStorage
  const [userRole, setUserRole] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const date = new Date()
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
  })
  const [selectedView, setSelectedView] = useState<string>("calendar")

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      const userData = JSON.parse(user)
      setUserRole(userData.role || "")
    }
  }, [])

  // Generate dummy attendance data for the month
  const generateMonthAttendanceData = () => {
    const [year, month] = selectedMonth.split('-').map(Number)
    const daysInMonth = new Date(year, month, 0).getDate()
    const data = []
    
    // Start from the 1st day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day)
      // Skip weekends (Saturday and Sunday)
      if (date.getDay() === 0 || date.getDay() === 6) continue
      
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const dayName = date.toLocaleString('en-US', { weekday: 'long' })
      
      // Determine status based on some pattern
      let status
      if (day % 15 === 0) {
        status = "Absent" // Every 15th is absent
      } else if (day % 10 === 0) {
        status = "Late" // Every 10th is late
      } else {
        status = "Present" // Rest are present
      }
      
      // Special cases for studentId specific patterns
      if (studentId === "1035") {
        // Student 1 has better attendance
        if (day === 15) status = "Late" // Convert one absence to late
      } else {
        // Student 2 has more absences
        if (day % 7 === 0) status = "Absent" // Additional absences
      }
      
      data.push({
        date: dateStr,
        status: status,
        day: dayName
      })
    }
    
    return data
  }

  // Dummy attendance data
  const attendanceData = generateMonthAttendanceData()

  const handleGenerateAttendanceReport = () => {
    generatePDF({
      title: `Attendance Report - Student ID: ${studentId} - ${getMonthName(selectedMonth)}`,
      data: attendanceData,
      columns: [
        { header: "Date", key: "date" },
        { header: "Day", key: "day" },
        { header: "Status", key: "status" },
      ],
    })
  }

  // Calculate attendance statistics
  const totalDays = attendanceData.length
  const presentDays = attendanceData.filter((record) => record.status === "Present").length
  const absentDays = attendanceData.filter((record) => record.status === "Absent").length
  const lateDays = attendanceData.filter((record) => record.status === "Late").length
  const attendancePercentage = ((presentDays / totalDays) * 100).toFixed(1)

  // Generate month options for the last 12 months
  const getMonthOptions = () => {
    const options = []
    const currentDate = new Date()

    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate)
      date.setMonth(currentDate.getMonth() - i)
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const label = date.toLocaleString("default", { month: "long", year: "numeric" })
      options.push({ value, label })
    }

    return options
  }

  const getMonthName = (monthStr: string) => {
    const [year, month] = monthStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, 1)
    return date.toLocaleString("default", { month: "long", year: "numeric" })
  }

  const monthOptions = getMonthOptions()

  // Generate calendar days
  const generateCalendarDays = () => {
    const [year, month] = selectedMonth.split('-').map(Number)
    const daysInMonth = new Date(year, month, 0).getDate()
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay()
    
    // Create an array of days in the month
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    
    // Add empty days at the beginning for correct alignment
    // Sunday is 0 in JS but we want Monday as first day (1), so we adjust
    const emptyDays = Array.from({ length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 }, (_, i) => null)
    
    return [...emptyDays, ...days]
  }

  const calendarDays = generateCalendarDays()

  // Helper to get attendance status for a specific date
  const getAttendanceForDate = (day: number | null) => {
    if (day === null) return null
    
    const [year, month] = selectedMonth.split('-')
    const dateString = `${year}-${month}-${String(day).padStart(2, '0')}`
    
    return attendanceData.find(record => record.date === dateString)?.status || null
  }

  // Check if a date is today
  const isToday = (day: number | null) => {
    if (day === null) return false
    
    const today = new Date()
    const [year, month] = selectedMonth.split('-').map(Number)
    
    return today.getDate() === day && 
           today.getMonth() + 1 === month && 
           today.getFullYear() === year
  }

  // Check if a day is a weekend
  const isWeekend = (day: number | null) => {
    if (day === null) return false
    
    const [year, month] = selectedMonth.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return date.getDay() === 0 || date.getDay() === 6
  }

  // Get day color class based on attendance
  const getDayColorClass = (status: string | null, day: number | null) => {
    if (isWeekend(day)) return 'bg-gray-100 border-gray-200'
    if (!status) return ''
    switch(status) {
      case 'Present': return 'bg-green-50 border-green-200'
      case 'Absent': return 'bg-red-50 border-red-200'
      case 'Late': return 'bg-amber-50 border-amber-200'
      default: return ''
    }
  }

  // Get text color class based on attendance
  const getTextColorClass = (status: string | null, day: number | null) => {
    if (isWeekend(day)) return 'text-gray-500'
    if (!status) return ''
    switch(status) {
      case 'Present': return 'text-green-800'
      case 'Absent': return 'text-red-800'
      case 'Late': return 'text-amber-800'
      default: return ''
    }
  }

  // Calculate streak
  const getCurrentStreak = () => {
    let streak = 0
    
    // Sort data by date
    const sortedData = [...attendanceData].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    
    for (const record of sortedData) {
      if (record.status === "Present") {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  const currentStreak = getCurrentStreak()

  // Calculate attendance trend
  const getAttendanceTrend = () => {
    // Get last 5 days attendance
    const lastFive = attendanceData
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .reverse()
    
    return lastFive.map(record => record.status === "Present" ? 100 : record.status === "Late" ? 50 : 0)
  }

  const attendanceTrend = getAttendanceTrend()

  return (
    <Card className="shadow-sm hover:shadow-md transition-all">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold text-teal-800">Attendance Record</CardTitle>
          <CardDescription>
            Your attendance record for {getMonthName(selectedMonth)}
          </CardDescription>
        </div>
        <div className="flex gap-2 items-center">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleGenerateAttendanceReport}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-teal-50 border-teal-200 dark:bg-teal-900/20 dark:border-teal-900">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-teal-600 font-medium">Attendance Rate</p>
                <Badge className="bg-teal-100 text-teal-800">{attendancePercentage}%</Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-teal-700">{presentDays}</p>
                <p className="text-sm text-teal-600">days present</p>
              </div>
              <Progress value={parseFloat(attendancePercentage)} className="h-1.5 mt-3 bg-teal-200 [&>div]:bg-teal-600" />
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-red-600 font-medium">Absent Days</p>
                <Badge className="bg-red-100 text-red-800">{absentDays} days</Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-red-700">{((absentDays / totalDays) * 100).toFixed(1)}%</p>
                <p className="text-sm text-red-600">absence rate</p>
              </div>
              <div className="flex items-center gap-1 mt-3">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <p className="text-xs text-red-600">
                  {absentDays > 3 ? "High absence rate! Improvement needed." : "Acceptable absence rate."}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-amber-600 font-medium">Current Streak</p>
                <Badge className="bg-amber-100 text-amber-800">{currentStreak} days</Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-amber-700">{currentStreak}</p>
                <p className="text-sm text-amber-600">days in a row</p>
              </div>
              <div className="mt-3 flex gap-1">
                {[...Array(7)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 flex-1 rounded-sm ${
                      i < currentStreak % 7 ? 'bg-amber-500' : 'bg-amber-200'
                    }`}
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-blue-600 font-medium">Last 5 Days</p>
                <Badge className="bg-blue-100 text-blue-800">Trend</Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-blue-700">
                  {attendanceTrend[attendanceTrend.length - 1] === 100 ? "Present" : 
                   attendanceTrend[attendanceTrend.length - 1] === 50 ? "Late" : "Absent"}
                </p>
                <p className="text-sm text-blue-600">today</p>
              </div>
              <div className="flex items-end h-8 gap-1 mt-3">
                {attendanceTrend.map((value, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end">
                    <div 
                      className={`w-full rounded-t 
                        ${value === 100 ? 'bg-green-500 h-full' : 
                          value === 50 ? 'bg-amber-500 h-1/2' : 
                          'bg-red-500 h-1/5'}`
                      }
                    ></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
          <TabsList className="grid grid-cols-2 w-48 mb-4">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="space-y-4">
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <div className="grid grid-cols-7 bg-teal-50 border-b">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-teal-800">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {calendarDays.map((day, i) => {
                  const status = getAttendanceForDate(day)
                  const todayIndicator = isToday(day)
                  const weekend = isWeekend(day)
                  
                  return (
                    <div 
                      key={i} 
                      className={`p-2 min-h-[80px] border border-gray-100 relative 
                        ${day === null ? 'bg-gray-50' : getDayColorClass(status, day)}
                        ${todayIndicator ? 'ring-2 ring-blue-500 ring-inset' : ''}
                        ${weekend ? 'opacity-60' : ''}
                        hover:bg-opacity-80 transition-colors
                      `}
                    >
                      {day !== null && (
                        <>
                          <div className={`flex justify-between items-center mb-2 ${getTextColorClass(status, day)}`}>
                            <span className={`text-sm font-medium 
                              ${todayIndicator ? 'bg-blue-500 text-white h-6 w-6 rounded-full flex items-center justify-center' : ''} 
                              ${weekend ? 'text-gray-400' : ''}`
                            }>
                              {day}
                            </span>
                            {status && !weekend && (
                              <div className={`h-3 w-3 rounded-full 
                                ${status === 'Present' ? 'bg-green-500' : 
                                  status === 'Absent' ? 'bg-red-500' : 
                                  'bg-amber-500'}`
                              }>
                              </div>
                            )}
                          </div>
                          
                          {/* Show weekends label */}
                          {weekend && (
                            <div className="text-xs text-gray-400 flex items-center justify-center h-full">
                              Weekend
                            </div>
                          )}
                          
                          {/* Show status badge only for school days */}
                          {status && !weekend && (
                            <div className={`text-xs rounded-full px-2 py-1 inline-flex items-center gap-1 
                              ${status === 'Present' ? 'bg-green-100 text-green-800 border border-green-200' :
                                status === 'Absent' ? 'bg-red-100 text-red-800 border border-red-200' :
                                'bg-amber-100 text-amber-800 border border-amber-200'
                              }`
                            }>
                              {status === 'Present' ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : status === 'Absent' ? (
                                <XCircle className="h-3 w-3" />
                              ) : (
                                <AlertTriangle className="h-3 w-3" />
                              )}
                              {status}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="flex justify-end gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Present</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span>Late</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Absent</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span>Weekend</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full ring-2 ring-blue-500"></div>
                <span>Today</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="list">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-teal-50">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((record, index) => (
                    <TableRow key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.day}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            record.status === "Present"
                              ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : record.status === "Absent"
                              ? "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                          }
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          School Attendance Requirement: Minimum 85% attendance needed to qualify for final examinations
        </div>
      </CardFooter>
    </Card>
  )
}
