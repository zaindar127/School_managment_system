"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Save, Printer } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { generatePDF } from "@/lib/pdf-generator"

export function AttendanceTracker() {
  const [selectedClass, setSelectedClass] = useState("two")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [user, setUser] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const userData = JSON.parse(userStr)
      setUser(userData)

      // If user is a teacher, set the selected class to their assigned class
      if (userData.role === "teacher" && userData.class) {
        setSelectedClass(userData.class.toLowerCase())
      }
    }
  }, [])

  useEffect(() => {
    // Dummy data for students based on selected class
    if (selectedClass === "two") {
      setStudents([
        { id: "1035", name: "Muhammad Muheeb", status: "present" },
        { id: "1042", name: "Ahmed Hassan", status: "present" },
        { id: "1056", name: "Ali Ahmed", status: "absent" },
        { id: "1078", name: "Sara Khan", status: "present" },
        { id: "1089", name: "Hassan Ali", status: "present" },
        { id: "1092", name: "Fatima Zahra", status: "absent" },
        { id: "1095", name: "Zainab Ali", status: "present" },
      ])
    } else if (selectedClass === "four") {
      setStudents([
        { id: "1036", name: "Ayesha Khan", status: "present" },
        { id: "1045", name: "Fatima Zahra", status: "absent" },
        { id: "1058", name: "Zainab Ali", status: "present" },
        { id: "1067", name: "Bilal Ahmed", status: "present" },
        { id: "1075", name: "Ahmed Ali", status: "present" },
        { id: "1082", name: "Hassan Khan", status: "absent" },
      ])
    } else {
      setStudents([
        { id: "1001", name: "Student 1", status: "present" },
        { id: "1002", name: "Student 2", status: "present" },
        { id: "1003", name: "Student 3", status: "absent" },
        { id: "1004", name: "Student 4", status: "present" },
        { id: "1005", name: "Student 5", status: "present" },
      ])
    }
  }, [selectedClass])

  const handleStatusChange = (id: string, status: string) => {
    setStudents(students.map((student) => (student.id === id ? { ...student, status } : student)))
  }

  const handleSaveAttendance = () => {
    // In a real app, this would save to the backend
    alert("Attendance saved successfully!")
  }

  const handlePrintAttendance = () => {
    const dataToExport = students.map((student) => ({
      id: student.id,
      name: student.name,
      status: student.status.charAt(0).toUpperCase() + student.status.slice(1),
      date: format(selectedDate, "PPP"),
    }))

    generatePDF({
      title: `Class ${selectedClass.charAt(0).toUpperCase() + selectedClass.slice(1)} - Attendance Report (${format(selectedDate, "PPP")})`,
      data: dataToExport,
      columns: [
        { header: "ID", key: "id" },
        { header: "Name", key: "name" },
        { header: "Status", key: "status" },
        { header: "Date", key: "date" },
      ],
    })
  }

  const presentCount = students.filter((student) => student.status === "present").length
  const absentCount = students.filter((student) => student.status === "absent").length

  // Check if user is a teacher and if they're allowed to edit this class
  const isTeacherForClass = user?.role === "teacher" && user?.class?.toLowerCase() === selectedClass.toLowerCase()

  // Admin can edit any class
  const canEditAttendance = user?.role === "admin" || isTeacherForClass

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Tracker</CardTitle>
        <CardDescription>Mark daily attendance for students</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Select
              value={selectedClass}
              onValueChange={setSelectedClass}
              disabled={user?.role === "teacher"} // Teachers can't change class
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nursery">Nursery</SelectItem>
                <SelectItem value="prep">Prep</SelectItem>
                <SelectItem value="one">One</SelectItem>
                <SelectItem value="two">Two</SelectItem>
                <SelectItem value="three">Three</SelectItem>
                <SelectItem value="four">Four</SelectItem>
                <SelectItem value="five">Five</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="rounded-md border mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={student.status}
                      onValueChange={(value) => handleStatusChange(student.id, value)}
                      disabled={!canEditAttendance}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="leave">Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300 text-sm py-2 px-4"
            >
              Present: {presentCount}
            </Badge>
            <Badge
              variant="outline"
              className="bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300 text-sm py-2 px-4"
            >
              Absent: {absentCount}
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-sm py-2 px-4"
            >
              Total: {students.length}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button onClick={handlePrintAttendance}>
              <Printer className="mr-2 h-4 w-4" />
              Generate PDF
            </Button>
            {canEditAttendance && (
              <Button onClick={handleSaveAttendance}>
                <Save className="mr-2 h-4 w-4" />
                Save Attendance
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
