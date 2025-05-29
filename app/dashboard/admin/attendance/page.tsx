"use client"

import { StudentAttendanceHistory } from "@/components/student-attendance-history"
import { useState } from "react"
import { Card } from "@/components/ui/card"
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
            <TabsList className="mb-6 flex flex-col sm:flex-row gap-2 bg-blue-50 rounded-xl p-2 shadow-sm">
              <TabsTrigger value="teachers" className="flex-1 text-base font-semibold px-6 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md whitespace-nowrap">
                Teacher Attendance
              </TabsTrigger>
              <TabsTrigger value="students" className="flex-1 text-base font-semibold px-6 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md whitespace-nowrap">
                Student Attendance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="teachers">
              <div className="mb-8 space-y-4 md:space-y-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[auto_1fr_auto] gap-4 items-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full sm:w-[180px] justify-start text-left font-normal border-2 border-blue-200 bg-blue-50 hover:bg-blue-100",
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

                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 sm:flex-none rounded-full border-2 border-green-200 bg-green-50 hover:bg-green-100 text-green-700 font-semibold" 
                      onClick={() => markAll("present")}
                    >
                      Mark All Present
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm" 
                      className="flex-1 sm:flex-none rounded-full border-2 border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-semibold" 
                      onClick={() => markAll("absent")}
                    >
                      Mark All Absent
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm" 
                      className="flex-1 sm:flex-none rounded-full border-2 border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-semibold" 
                      onClick={() => markAll("leave")}
                    >
                      Mark All Leave
                    </Button>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="default" className="flex-1 sm:flex-none rounded-full bg-gradient-to-r from-green-400 to-blue-500 shadow font-bold">Save</Button>
                    <Button variant="outline" className="flex-1 sm:flex-none rounded-full border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold">
                      <Download className="h-4 w-4 mr-2" />Export
                    </Button>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl shadow border border-blue-100 bg-white">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-base text-gray-700 px-4 py-3 bg-gray-50/80">Name</TableHead>
                        <TableHead className="text-base text-gray-700 px-4 py-3 bg-gray-50/80">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teacherAttendance.map((teacher) => (
                        <TableRow key={teacher.id} className="hover:bg-blue-50/60 transition">
                          <TableCell className="font-semibold text-gray-800 text-base px-4 py-3">{teacher.name}</TableCell>
                          <TableCell className="px-4 py-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <Select value={teacher.status} onValueChange={status => handleStatusChange(teacher.id, status)}>
                                <SelectTrigger className={cn("min-w-[120px] border-2",
                                  teacher.status === "present" ? "bg-green-50 border-green-200 text-green-700" :
                                  teacher.status === "absent" ? "bg-red-50 border-red-200 text-red-700" :
                                  teacher.status === "leave" ? "bg-yellow-50 border-yellow-200 text-yellow-700" : ""
                                )}>
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
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-6 justify-between">
                <div className="text-sm text-gray-500">Total: {teacherAttendance.length} teachers</div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                    Present: {presentCount}
                  </span>
                  <span className="px-4 py-2 rounded-full bg-red-100 text-red-700 font-semibold text-sm">
                    Absent: {absentCount}
                  </span>
                  <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm">
                    Leave: {leaveCount}
                  </span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="students">
              <StudentAttendanceHistory />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
