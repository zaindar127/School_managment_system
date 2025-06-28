"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Save, FileText, Check, X, Clock } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { generatePDF } from "@/lib/pdf-generator"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export function TeacherAttendanceTracker({ className }: { className: string }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [attendanceData, setAttendanceData] = useState<any[]>([])
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Dummy data for students in the class
  const students =
    className === "Two"
      ? [
          { id: "1035", name: "Muhammad Muheeb", status: "present" },
          { id: "1042", name: "Ahmed Hassan", status: "present" },
          { id: "1056", name: "Ali Ahmed", status: "absent" },
          { id: "1078", name: "Sara Khan", status: "present" },
          { id: "1089", name: "Hassan Ali", status: "present" },
        ]
      : [
          { id: "1036", name: "Ayesha Khan", status: "present" },
          { id: "1045", name: "Fatima Zahra", status: "absent" },
          { id: "1058", name: "Zainab Ali", status: "present" },
          { id: "1067", name: "Bilal Ahmed", status: "present" },
        ]

  useEffect(() => {
    setAttendanceData(students)
  }, [className])

  const handleStatusChange = (id: string, status: string) => {
    const updatedStudents = attendanceData.map((student) => 
      student.id === id ? { ...student, status } : student
    )
    setAttendanceData(updatedStudents)
  }

  const handleSaveAttendance = () => {
    setIsLoading(true)
    
    // Simulated API call
    setTimeout(() => {
      setIsAttendanceMarked(true)
      setIsLoading(false)
      
      toast.success("Attendance saved", {
        description: `Attendance for Class ${className} on ${format(selectedDate, "PPP")} has been saved.`,
      })
    }, 1000)
  }

  const handleGenerateAttendanceReport = () => {
    const dataToExport = attendanceData.map((student) => ({
      id: student.id,
      name: student.name,
      status: student.status.charAt(0).toUpperCase() + student.status.slice(1),
      date: format(selectedDate, "PPP"),
    }))

    generatePDF({
      title: `Class ${className} - Attendance Report (${format(selectedDate, "PPP")})`,
      data: dataToExport,
      columns: [
        { header: "ID", key: "id" },
        { header: "Name", key: "name" },
        { header: "Status", key: "status" },
        { header: "Date", key: "date" },
      ],
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <Check className="mr-2 h-4 w-4 text-green-500" />
      case "absent":
        return <X className="mr-2 h-4 w-4 text-red-500" />
      case "leave":
        return <Clock className="mr-2 h-4 w-4 text-amber-500" />
      default:
        return null
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800"
      case "absent":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800"
      case "leave":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900 dark:text-amber-300 dark:border-amber-800"
      default:
        return ""
    }
  }

  const presentCount = attendanceData.filter((student) => student.status === "present").length
  const absentCount = attendanceData.filter((student) => student.status === "absent").length
  const leaveCount = attendanceData.filter((student) => student.status === "leave").length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-sm hover:shadow transition-all duration-200 border-t-4 border-t-primary border-l-0 border-r-0 border-b-0">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 gap-4">
          <div>
            <CardTitle>Attendance Tracker</CardTitle>
            <CardDescription>Record daily attendance for Class {className}</CardDescription>
          </div>
          <Button onClick={handleGenerateAttendanceReport} variant="outline" className="gap-2 w-full sm:w-auto">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="mark" className="mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
              <TabsTrigger value="history">View History</TabsTrigger>
            </TabsList>
            <TabsContent value="mark" className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full sm:w-[240px] justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceData.map((student, index) => (
                      <motion.tr 
                        key={student.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="group"
                      >
                        <TableCell className="font-medium">{student.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={student.avatar} alt={student.name} />
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {student.name.split(' ').map((word: string) => word[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span>{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={student.status} 
                            onValueChange={(value) => handleStatusChange(student.id, value)}
                          >
                            <SelectTrigger className={cn(
                              "w-full justify-center",
                              getStatusClass(student.status)
                            )}>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="present" className="flex items-center">
                                <Check className="mr-2 h-4 w-4 text-green-500" />
                                <span>Present</span>
                              </SelectItem>
                              <SelectItem value="absent" className="flex items-center">
                                <X className="mr-2 h-4 w-4 text-red-500" />
                                <span>Absent</span>
                              </SelectItem>
                              <SelectItem value="leave" className="flex items-center">
                                <Clock className="mr-2 h-4 w-4 text-amber-500" />
                                <span>Leave</span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                <div className="flex flex-wrap gap-4 justify-center sm:justify-start w-full sm:w-auto">
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
                    className="bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-300 text-sm py-2 px-4"
                  >
                    Leave: {leaveCount}
                  </Badge>
                </div>
                <Button 
                  onClick={handleSaveAttendance} 
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Attendance
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="history">
              <div className="min-h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground">Attendance history will be shown here</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
