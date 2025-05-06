"use client"
import { AttendanceTracker } from "@/components/attendance-tracker"
import { StudentAttendanceHistory } from "@/components/student-attendance-history"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Download, Users } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

// Dummy teacher data for demonstration
const TEACHERS = [
  { id: "t1", name: "Ali Raza", status: "present" },
  { id: "t2", name: "Sara Khan", status: "absent" },
  { id: "t3", name: "Bilal Ahmed", status: "present" },
  { id: "t4", name: "Fatima Zahra", status: "leave" },
  { id: "t5", name: "Zainab Ali", status: "present" },
]

export default function AttendancePage() {
  const [tab, setTab] = useState("teachers")
  const [teacherDate, setTeacherDate] = useState(new Date())
  const [teacherAttendance, setTeacherAttendance] = useState(TEACHERS)

  // Bulk actions
  const markAll = (status: string) => {
    setTeacherAttendance(teacherAttendance.map(t => ({ ...t, status })))
  }

  const handleStatusChange = (id: string, status: string) => {
    setTeacherAttendance(teacherAttendance.map(t => t.id === id ? { ...t, status } : t))
  }

  const presentCount = teacherAttendance.filter(t => t.status === "present").length
  const absentCount = teacherAttendance.filter(t => t.status === "absent").length
  const leaveCount = teacherAttendance.filter(t => t.status === "leave").length

  const statusBadge = (status: string) => {
    if (status === "present") return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">Present</span>
    if (status === "absent") return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">Absent</span>
    if (status === "leave") return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">Leave</span>
    return null
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-10 px-2 sm:px-8">
      <div className="w-full">
        <div className="flex items-center gap-3 mb-8">
          <span className="inline-flex items-center justify-center rounded-full bg-blue-100 p-2">
            <Users className="h-7 w-7 text-blue-500" />
          </span>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Attendance Management</h1>
        </div>
        <Card className="p-6 w-full shadow-2xl rounded-2xl bg-white/90 border border-blue-100">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="mb-6 flex gap-4 bg-blue-50 rounded-xl p-2 shadow-sm">
              <TabsTrigger value="teachers" className="text-base font-semibold px-6 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">Teacher Attendance</TabsTrigger>
              <TabsTrigger value="students" className="text-base font-semibold px-6 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">Student Attendance</TabsTrigger>
            </TabsList>

            {/* Teacher Attendance Tab */}
            <TabsContent value="teachers">
              <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex gap-2 items-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[180px] justify-start text-left font-normal border-2 border-blue-200 bg-blue-50 hover:bg-blue-100",
                          !teacherDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                        {teacherDate ? format(teacherDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={teacherDate} onSelect={date => date && setTeacherDate(date)} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <Button variant="outline" className="rounded-full border-2 border-green-200 bg-green-50 hover:bg-green-100 text-green-700 font-semibold" onClick={() => markAll("present")}>Mark All Present</Button>
                  <Button variant="outline" className="rounded-full border-2 border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-semibold" onClick={() => markAll("absent")}>Mark All Absent</Button>
                  <Button variant="outline" className="rounded-full border-2 border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-semibold" onClick={() => markAll("leave")}>Mark All Leave</Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="default" className="rounded-full bg-gradient-to-r from-green-400 to-blue-500 shadow font-bold px-6 py-2">Save</Button>
                  <Button variant="outline" className="rounded-full border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold px-6 py-2"><Download className="h-4 w-4 mr-2" />Export</Button>
                </div>
              </div>
              <div className="overflow-x-auto rounded-2xl shadow border border-blue-100 bg-white">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-base text-gray-700 px-4 py-2">Name</TableHead>
                      <TableHead className="text-base text-gray-700 px-4 py-2">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacherAttendance.map((teacher) => (
                      <TableRow key={teacher.id} className="hover:bg-blue-50/60 transition">
                        <TableCell className="font-semibold text-gray-800 text-base px-4 py-2">{teacher.name}</TableCell>
                        <TableCell className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <Select value={teacher.status} onValueChange={status => handleStatusChange(teacher.id, status)}>
                              <SelectTrigger className={cn("w-[120px] border-2",
                                teacher.status === "present" ? "bg-green-50 border-green-200 text-green-700" :
                                teacher.status === "absent" ? "bg-red-50 border-red-200 text-red-700" :
                                teacher.status === "leave" ? "bg-yellow-50 border-yellow-200 text-yellow-700" : "")}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="present">Present</SelectItem>
                                <SelectItem value="absent">Absent</SelectItem>
                                <SelectItem value="leave">Leave</SelectItem>
                              </SelectContent>
                            </Select>
                            {statusBadge(teacher.status)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-end">
                <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">Present: {presentCount}</span>
                <span className="px-4 py-2 rounded-full bg-red-100 text-red-700 font-semibold">Absent: {absentCount}</span>
                <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold">Leave: {leaveCount}</span>
              </div>
            </TabsContent>

            {/* Student Attendance Tab */}
            <TabsContent value="students">
              <StudentAttendanceHistory />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
