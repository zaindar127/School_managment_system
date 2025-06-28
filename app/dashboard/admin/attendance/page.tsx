"use client"

import { StudentAttendanceHistory } from "@/components/student-attendance-history"
import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Download, Users, Search, CheckCircle, XCircle, Clock, UserCheck } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { toast } from "sonner"

// Dummy teacher data for demonstration
const TEACHERS = [
  { id: "t1", name: "Ali Raza", email: "ali.raza@school.com", avatar: "/placeholder-user.jpg", status: "present" },
  { id: "t2", name: "Sara Khan", email: "sara.khan@school.com", avatar: "/placeholder-user.jpg", status: "absent" },
  { id: "t3", name: "Bilal Ahmed", email: "bilal.ahmed@school.com", avatar: "/placeholder-user.jpg", status: "present" },
  { id: "t4", name: "Fatima Zahra", email: "fatima.zahra@school.com", avatar: "/placeholder-user.jpg", status: "leave" },
  { id: "t5", name: "Zainab Ali", email: "zainab.ali@school.com", avatar: "/placeholder-user.jpg", status: "present" },
]

export default function AttendancePage() {
  const [tab, setTab] = useState("teachers")
  const [teacherDate, setTeacherDate] = useState(new Date())
  const [teacherAttendance, setTeacherAttendance] = useState(TEACHERS)
  const [searchQuery, setSearchQuery] = useState("")
  const [saving, setSaving] = useState(false)

  // Filter teachers based on search query
  const filteredTeachers = teacherAttendance.filter(teacher => 
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Bulk actions
  const markAll = (status: string) => {
    setTeacherAttendance(teacherAttendance.map(t => ({ ...t, status })))
    toast.success(`All teachers marked as ${status}`)
  }

  const handleStatusChange = (id: string, status: string) => {
    setTeacherAttendance(teacherAttendance.map(t => t.id === id ? { ...t, status } : t))
  }

  const presentCount = teacherAttendance.filter(t => t.status === "present").length
  const absentCount = teacherAttendance.filter(t => t.status === "absent").length
  const leaveCount = teacherAttendance.filter(t => t.status === "leave").length

  const statusBadge = (status: string) => {
    if (status === "present") return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">Present</Badge>
    if (status === "absent") return <Badge className="bg-rose-50 text-rose-700 border border-rose-200">Absent</Badge>
    if (status === "leave") return <Badge className="bg-amber-50 text-amber-700 border border-amber-200">Leave</Badge>
    return null
  }

  const saveAttendance = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success("Attendance saved successfully")
    }, 1000)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="space-y-6">
      <motion.div 
        className="relative overflow-hidden bg-gradient-to-r from-slate-50 to-gray-100 rounded-xl p-4 sm:p-8 shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 right-0 opacity-5">
          <motion.div 
            animate={{ 
              rotate: [0, 360],
              transition: { duration: 60, repeat: Infinity, ease: "linear" }
            }}
          >
            <UserCheck className="h-32 w-32 sm:h-64 sm:w-64 -mt-10 -mr-10 sm:-mt-20 sm:-mr-20 text-gray-400" />
          </motion.div>
        </div>
        
        <div className="relative z-10">
          <Badge className="bg-white/80 text-gray-700 border border-gray-200 hover:bg-white px-3 py-1 mb-3">
            <Clock className="h-3 w-3 mr-1" /> {formatDate(teacherDate)}
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-800 mb-2">
            Staff Attendance Management
          </h1>
          <p className="text-gray-600 max-w-2xl text-sm sm:text-base">
            Monitor and manage attendance for all teaching staff. Track daily attendance, leaves, and generate reports.
          </p>
        </div>
      </motion.div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="w-full max-w-md mb-6 bg-gray-100">
          <TabsTrigger value="teachers" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">Teacher Attendance</TabsTrigger>
          <TabsTrigger value="students" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">Student Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="teachers" className="mt-0">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2 bg-gray-50 px-3 sm:px-4 py-2 rounded-lg border border-gray-200 w-full lg:w-auto">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              <span className="font-medium text-gray-700 text-sm sm:text-base">Total Teachers: {teacherAttendance.length}</span>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs border border-emerald-200">
                  {presentCount} Present
                </span>
                <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-xs border border-rose-200">
                  {absentCount} Absent
                </span>
                <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-xs border border-amber-200">
                  {leaveCount} Leave
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  type="text" 
                  placeholder="Search teachers..." 
                  className="pl-9 bg-white border-gray-200 focus:border-gray-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 w-full sm:w-auto",
                      !teacherDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                    {teacherDate ? format(teacherDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={teacherDate} onSelect={date => date && setTeacherDate(date)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline"
                size="sm"
                className="bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-700" 
                onClick={() => markAll("present")}
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Mark All Present
              </Button>
              <Button 
                variant="outline"
                size="sm" 
                className="bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-700" 
                onClick={() => markAll("absent")}
              >
                <XCircle className="mr-2 h-4 w-4" /> Mark All Absent
              </Button>
              <Button 
                variant="outline"
                size="sm" 
                className="bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-700" 
                onClick={() => markAll("leave")}
              >
                <Clock className="mr-2 h-4 w-4" /> Mark All Leave
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                className="bg-slate-600 hover:bg-slate-700 text-white"
                onClick={saveAttendance}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Attendance"}
              </Button>
              
              <Button variant="outline" className="border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
                <Download className="h-4 w-4 mr-2" />Export
              </Button>
            </div>
          </div>

          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-0">
              <div className="rounded-md border border-gray-200 overflow-x-auto">
                <div className="bg-gray-50 p-3 sm:p-4 grid grid-cols-12 gap-2 sm:gap-4 font-medium text-gray-700 border-b border-gray-200 min-w-[800px]">
                  <div className="col-span-1 flex justify-center text-xs sm:text-sm">#</div>
                  <div className="col-span-4 text-xs sm:text-sm">Teacher Name</div>
                  <div className="col-span-3 text-xs sm:text-sm">Email</div>
                  <div className="col-span-2 text-xs sm:text-sm">Status</div>
                  <div className="col-span-2 text-right text-xs sm:text-sm">Action</div>
                </div>
                
                {filteredTeachers.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No teachers found matching your search
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredTeachers.map((teacher, index) => (
                      <motion.div 
                        key={teacher.id}
                        className="p-3 sm:p-4 grid grid-cols-12 gap-2 sm:gap-4 items-center hover:bg-gray-50/50 transition-colors min-w-[800px]"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03, duration: 0.3 }}
                      >
                        <div className="col-span-1 flex justify-center font-medium text-gray-500 text-xs sm:text-sm">
                          {index + 1}
                        </div>
                        <div className="col-span-4 flex items-center gap-2 sm:gap-3">
                          <Avatar className="h-6 w-6 sm:h-8 sm:w-8 border border-gray-200">
                            <AvatarImage src={teacher.avatar} alt={teacher.name} />
                            <AvatarFallback className="bg-gray-100 text-gray-600 text-xs sm:text-sm">{teacher.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-800 text-xs sm:text-sm">{teacher.name}</p>
                            <p className="text-xs text-gray-500">ID: {teacher.id}</p>
                          </div>
                        </div>
                        <div className="col-span-3 text-xs sm:text-sm text-gray-600 truncate">{teacher.email}</div>
                        <div className="col-span-2">
                          {statusBadge(teacher.status)}
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <Select value={teacher.status} onValueChange={status => handleStatusChange(teacher.id, status)}>
                            <SelectTrigger className={cn("w-[100px] sm:w-[120px] border border-gray-200 bg-white text-xs sm:text-sm",
                              teacher.status === "present" ? "text-emerald-700" :
                              teacher.status === "absent" ? "text-rose-700" :
                              teacher.status === "leave" ? "text-amber-700" : "text-gray-700"
                            )}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="present">Present</SelectItem>
                              <SelectItem value="absent">Absent</SelectItem>
                              <SelectItem value="leave">Leave</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="mt-0">
          <StudentAttendanceHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}
