"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { ArrowLeft, Save, Clock, Plus, X, Calendar, Download, Search, BookOpen, Users, GraduationCap, Clock10, ClipboardList } from "lucide-react"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminTimetablePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [selectedTeacher, setSelectedTeacher] = useState<string>("")
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [selectedDay, setSelectedDay] = useState<string>("monday")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showConflictDialog, setShowConflictDialog] = useState(false)
  const [conflictingSlots, setConflictingSlots] = useState<TimetableEntry[]>([])
  const [newSlot, setNewSlot] = useState({
    teacher: "",
    class: "",
    subject: "",
    day: "monday",
    startTime: "08:00",
    endTime: "09:00"
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [activeView, setActiveView] = useState("teachers")

  // Dummy data
  const teachers = [
    { id: "1", name: "Sarah Ahmed", department: "Primary", expertise: "Mathematics" },
    { id: "2", name: "Muhammad Ali", department: "Primary", expertise: "Science" },
    { id: "3", name: "Fatima Zahra", department: "Primary", expertise: "English" },
    { id: "4", name: "Ahmed Khan", department: "Middle School", expertise: "Physics" },
    { id: "5", name: "Aisha Malik", department: "Middle School", expertise: "Chemistry" },
    { id: "6", name: "Hassan Ali", department: "Middle School", expertise: "Computer Science" },
  ]

  const classes = [
    { id: "1", name: "Nursery", department: "Primary" },
    { id: "2", name: "Prep", department: "Primary" },
    { id: "3", name: "One", department: "Primary" },
    { id: "4", name: "Two", department: "Primary" },
    { id: "5", name: "Three", department: "Middle School" },
    { id: "6", name: "Four", department: "Middle School" },
    { id: "7", name: "Five", department: "Middle School" },
  ]

  const subjects = [
    { id: "1", name: "Mathematics", classes: ["One", "Two", "Three", "Four", "Five"] },
    { id: "2", name: "English", classes: ["Nursery", "Prep", "One", "Two", "Three", "Four", "Five"] },
    { id: "3", name: "Science", classes: ["One", "Two", "Three"] },
    { id: "4", name: "Physics", classes: ["Four", "Five"] },
    { id: "5", name: "Chemistry", classes: ["Four", "Five"] },
    { id: "6", name: "Computer Science", classes: ["Three", "Four", "Five"] },
    { id: "7", name: "Urdu", classes: ["Nursery", "Prep", "One", "Two", "Three", "Four", "Five"] },
    { id: "8", name: "Islamiyat", classes: ["One", "Two", "Three", "Four", "Five"] },
  ]

  // Timetable data structure
  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

  // Define types for timetable entries
  type TeacherTimetableEntry = {
    class: string;
    subject: string;
    day: string;
    startTime: string;
    endTime: string;
  }

  type ClassTimetableEntry = {
    teacher: string;
    subject: string;
    day: string;
    startTime: string;
    endTime: string;
  }

  type TimetableEntry = TeacherTimetableEntry | ClassTimetableEntry;

  // Generate timetable for teachers
  const generateTeacherTimetable = (teacherId: string): TeacherTimetableEntry[] => {
    // In a real app, this would come from a database
    if (teacherId === "1") {
      return [
        { class: "Two", subject: "Mathematics", day: "monday", startTime: "08:00", endTime: "09:00" },
        { class: "One", subject: "Mathematics", day: "monday", startTime: "09:00", endTime: "10:00" },
        { class: "Three", subject: "Mathematics", day: "monday", startTime: "11:00", endTime: "12:00" },
        { class: "One", subject: "Mathematics", day: "tuesday", startTime: "08:00", endTime: "09:00" },
        { class: "Two", subject: "Mathematics", day: "tuesday", startTime: "10:00", endTime: "11:00" },
        { class: "Four", subject: "Mathematics", day: "tuesday", startTime: "12:00", endTime: "13:00" },
        { class: "Three", subject: "Mathematics", day: "wednesday", startTime: "09:00", endTime: "10:00" },
        { class: "Five", subject: "Mathematics", day: "wednesday", startTime: "11:00", endTime: "12:00" },
        { class: "Four", subject: "Mathematics", day: "thursday", startTime: "08:00", endTime: "09:00" },
        { class: "Five", subject: "Mathematics", day: "thursday", startTime: "10:00", endTime: "11:00" },
        { class: "One", subject: "Mathematics", day: "friday", startTime: "08:00", endTime: "09:00" },
        { class: "Three", subject: "Mathematics", day: "friday", startTime: "11:00", endTime: "12:00" },
      ]
    } else if (teacherId === "2") {
      return [
        { class: "One", subject: "Science", day: "monday", startTime: "10:00", endTime: "11:00" },
        { class: "Two", subject: "Science", day: "monday", startTime: "11:00", endTime: "12:00" },
        { class: "Three", subject: "Science", day: "tuesday", startTime: "09:00", endTime: "10:00" },
        { class: "One", subject: "Science", day: "wednesday", startTime: "08:00", endTime: "09:00" },
        { class: "Two", subject: "Science", day: "thursday", startTime: "11:00", endTime: "12:00" },
        { class: "Three", subject: "Science", day: "friday", startTime: "10:00", endTime: "11:00" },
      ]
    } else {
      // Return empty array for other teachers
      return []
    }
  }

  // Generate timetable for classes
  const generateClassTimetable = (className: string): ClassTimetableEntry[] => {
    // In a real app, this would come from a database
    if (className === "One") {
      return [
        { teacher: "Sarah Ahmed", subject: "Mathematics", day: "monday", startTime: "09:00", endTime: "10:00" },
        { teacher: "Muhammad Ali", subject: "Science", day: "monday", startTime: "10:00", endTime: "11:00" },
        { teacher: "Fatima Zahra", subject: "English", day: "monday", startTime: "11:00", endTime: "12:00" },
        { teacher: "Sarah Ahmed", subject: "Mathematics", day: "tuesday", startTime: "08:00", endTime: "09:00" },
        { teacher: "Aisha Malik", subject: "Urdu", day: "tuesday", startTime: "10:00", endTime: "11:00" },
        { teacher: "Hassan Ali", subject: "Islamiyat", day: "wednesday", startTime: "10:00", endTime: "11:00" },
        { teacher: "Muhammad Ali", subject: "Science", day: "wednesday", startTime: "08:00", endTime: "09:00" },
        { teacher: "Fatima Zahra", subject: "English", day: "thursday", startTime: "09:00", endTime: "10:00" },
        { teacher: "Aisha Malik", subject: "Urdu", day: "thursday", startTime: "11:00", endTime: "12:00" },
        { teacher: "Sarah Ahmed", subject: "Mathematics", day: "friday", startTime: "08:00", endTime: "09:00" },
        { teacher: "Muhammad Ali", subject: "Science", day: "friday", startTime: "09:00", endTime: "10:00" },
      ]
    } else if (className === "Two") {
      return [
        { teacher: "Sarah Ahmed", subject: "Mathematics", day: "monday", startTime: "08:00", endTime: "09:00" },
        { teacher: "Fatima Zahra", subject: "English", day: "monday", startTime: "09:00", endTime: "10:00" },
        { teacher: "Muhammad Ali", subject: "Science", day: "monday", startTime: "11:00", endTime: "12:00" },
        { teacher: "Hassan Ali", subject: "Islamiyat", day: "tuesday", startTime: "09:00", endTime: "10:00" },
        { teacher: "Sarah Ahmed", subject: "Mathematics", day: "tuesday", startTime: "10:00", endTime: "11:00" },
        { teacher: "Fatima Zahra", subject: "English", day: "wednesday", startTime: "11:00", endTime: "12:00" },
        { teacher: "Muhammad Ali", subject: "Science", day: "thursday", startTime: "11:00", endTime: "12:00" },
        { teacher: "Aisha Malik", subject: "Urdu", day: "friday", startTime: "10:00", endTime: "11:00" },
      ]
    } else {
      // Return empty array for other classes
      return []
    }
  }

  // Get current timetable based on selected view
  const getCurrentTimetable = (): TimetableEntry[] => {
    if (selectedTeacher && selectedTeacher !== "all") {
      return generateTeacherTimetable(selectedTeacher)
    } else if (selectedClass && selectedClass !== "all") {
      return generateClassTimetable(selectedClass)
    }
    return []
  }

  // Filter timetable by day if day is selected
  const getFilteredTimetable = () => {
    const timetable = getCurrentTimetable()
    if (selectedDay && selectedDay !== "all") {
      return timetable.filter(slot => slot.day === selectedDay)
    }
    return timetable
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <TimetablePageSkeleton />
  }

  // Check for time conflicts for a teacher
  const checkForTeacherConflicts = (teacherId: string, day: string, startTime: string, endTime: string): TimetableEntry[] => {
    const teacherSchedule = generateTeacherTimetable(teacherId);
    return teacherSchedule.filter(slot => 
      slot.day === day &&
      ((startTime >= slot.startTime && startTime < slot.endTime) ||
       (endTime > slot.startTime && endTime <= slot.endTime) ||
       (startTime <= slot.startTime && endTime >= slot.endTime))
    );
  }

  const handleAddSlot = () => {
    // Check for conflicts
    const teacher = teachers.find(t => t.id === newSlot.teacher);
    if (teacher) {
      const conflicts = checkForTeacherConflicts(
        newSlot.teacher,
        newSlot.day,
        newSlot.startTime,
        newSlot.endTime
      );
      
      if (conflicts.length > 0) {
        setConflictingSlots(conflicts);
        setShowConflictDialog(true);
        return;
      }
    }
    
    // No conflicts, add the slot
    toast.success("New timeslot added successfully");
    setShowAddDialog(false);
  }

  const handleSaveTimetable = () => {
    toast.success("Timetable saved successfully")
  }

  // Format time for display
  const formatTimeDisplay = (time: string) => {
    // Convert 24h format to 12h format
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  return (
    <motion.div 
      className="space-y-6 py-5 px-4 max-w-[1200px] mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-8 shadow-lg"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 opacity-10">
          <motion.div 
            animate={{ 
              rotate: [0, 360],
              transition: { duration: 60, repeat: Infinity, ease: "linear" }
            }}
          >
            <Clock className="h-64 w-64 -mt-20 -mr-20" />
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
        
        <div className="relative z-10">
          <Badge className="bg-white/20 text-white hover:bg-white/30 px-3 py-1 mb-3">
            Schedule Management
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Class Timetable
          </h1>
          <p className="text-indigo-100 max-w-2xl">
            Create and manage class schedules, assign teachers to subjects, and organize the academic timetable across all departments.
          </p>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <TimetableStatCard 
          title="Total Teachers"
          value={teachers.length.toString()}
          description="Available for scheduling"
          icon={Users}
          color="indigo"
        />
        <TimetableStatCard 
          title="Total Classes"
          value={classes.length.toString()}
          description="From Nursery to Class 5"
          icon={GraduationCap}
          color="purple"
        />
        <TimetableStatCard 
          title="Subjects"
          value={subjects.length.toString()}
          description="Across all departments"
          icon={BookOpen}
          color="blue"
        />
        <TimetableStatCard 
          title="School Hours"
          value="8am - 2pm"
          description="Monday to Saturday"
          icon={Clock10}
          color="pink"
        />
      </motion.div>

      {/* Filters and Controls */}
      <motion.div 
        className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search timetable..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Slot
        </Button>
        
        <Button
          onClick={handleSaveTimetable}
          variant="outline"
          className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:text-indigo-300 dark:border-indigo-800 dark:hover:bg-indigo-950"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Timetable
        </Button>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-950 rounded-lg shadow-sm border overflow-hidden"
      >
        <Tabs defaultValue="teachers" onValueChange={(value) => setActiveView(value)} className="w-full">
          <div className="border-b px-4">
            <TabsList className="p-0 bg-transparent h-14">
              <TabsTrigger 
                value="teachers" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 rounded-none h-14 px-4"
              >
                <Users className="mr-2 h-4 w-4" />
                Teacher Schedule
              </TabsTrigger>
              <TabsTrigger 
                value="classes" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 rounded-none h-14 px-4"
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                Class Schedule
              </TabsTrigger>
              <TabsTrigger 
                value="subjects" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 rounded-none h-14 px-4"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Subject Schedule
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="teachers" className="mt-0 p-4">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/3">
                  <Label htmlFor="teacher-select" className="text-sm font-medium mb-1.5 block">
                    Select Teacher
                  </Label>
                  <Select
                    value={selectedTeacher}
                    onValueChange={setSelectedTeacher}
                  >
                    <SelectTrigger id="teacher-select" className="bg-white dark:bg-gray-900">
                      <SelectValue placeholder="Select a teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Teachers</SelectItem>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name} ({teacher.expertise})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full md:w-1/3">
                  <Label htmlFor="day-select" className="text-sm font-medium mb-1.5 block">
                    Filter by Day
                  </Label>
                  <Select
                    value={selectedDay}
                    onValueChange={setSelectedDay}
                  >
                    <SelectTrigger id="day-select" className="bg-white dark:bg-gray-900">
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Days</SelectItem>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full md:w-1/3 md:self-end">
                  <Button
                    variant="outline"
                    className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:text-indigo-300 dark:border-indigo-800 dark:hover:bg-indigo-950"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Schedule
                  </Button>
                </div>
              </div>
              
              {selectedTeacher && (
                <Card className="border border-indigo-100 dark:border-indigo-900">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>
                          {selectedTeacher !== "all" 
                            ? teachers.find(t => t.id === selectedTeacher)?.name 
                            : "All Teachers"} Schedule
                        </CardTitle>
                        <CardDescription>
                          {selectedTeacher !== "all" && teachers.find(t => t.id === selectedTeacher)?.department} Department
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="text-indigo-700 border-indigo-200 dark:text-indigo-400 dark:border-indigo-800">
                        <Clock className="mr-1 h-3 w-3" />
                        {selectedDay !== "all" 
                          ? selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1) 
                          : "Full Week"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader className="bg-indigo-50 dark:bg-indigo-950">
                          <TableRow>
                            {selectedDay === "all" && <TableHead className="font-medium">Day</TableHead>}
                            <TableHead className="font-medium">Time</TableHead>
                            <TableHead className="font-medium">Class</TableHead>
                            <TableHead className="font-medium">Subject</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getFilteredTimetable().length > 0 ? (
                            getFilteredTimetable().map((slot, index) => (
                              <TableRow key={index} className="hover:bg-indigo-50/50 dark:hover:bg-indigo-950/50">
                                {selectedDay === "all" && (
                                  <TableCell className="capitalize font-medium">
                                    {slot.day}
                                  </TableCell>
                                )}
                                <TableCell className="whitespace-nowrap">
                                  <Badge variant="outline" className="text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700">
                                    {formatTimeDisplay(slot.startTime)} - {formatTimeDisplay(slot.endTime)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 text-indigo-600" />
                                    <span>{('class' in slot) ? slot.class : ''}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-indigo-600" />
                                    <span>{slot.subject}</span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={selectedDay === "all" ? 4 : 3} className="h-24 text-center">
                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                  <ClipboardList className="h-8 w-8 mb-2 opacity-40" />
                                  <p>No schedule found</p>
                                  <p className="text-sm">Select a different teacher or day, or add new slots</p>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="classes" className="mt-0 p-4">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/3">
                  <Label htmlFor="class-select" className="text-sm font-medium mb-1.5 block">
                    Select Class
                  </Label>
                  <Select
                    value={selectedClass}
                    onValueChange={setSelectedClass}
                  >
                    <SelectTrigger id="class-select" className="bg-white dark:bg-gray-900">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {classes.map((classItem) => (
                        <SelectItem key={classItem.id} value={classItem.name}>
                          Class {classItem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full md:w-1/3">
                  <Label htmlFor="day-select-class" className="text-sm font-medium mb-1.5 block">
                    Filter by Day
                  </Label>
                  <Select
                    value={selectedDay}
                    onValueChange={setSelectedDay}
                  >
                    <SelectTrigger id="day-select-class" className="bg-white dark:bg-gray-900">
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Days</SelectItem>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full md:w-1/3 md:self-end">
                  <Button
                    variant="outline"
                    className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:text-indigo-300 dark:border-indigo-800 dark:hover:bg-indigo-950"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Schedule
                  </Button>
                </div>
              </div>
              
              {selectedClass && (
                <Card className="border border-indigo-100 dark:border-indigo-900">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>
                          Class {selectedClass !== "all" ? selectedClass : "All"} Schedule
                        </CardTitle>
                        <CardDescription>
                          {selectedClass !== "all" 
                            ? classes.find(c => c.name === selectedClass)?.department 
                            : "All"} Department
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="text-indigo-700 border-indigo-200 dark:text-indigo-400 dark:border-indigo-800">
                        <Clock className="mr-1 h-3 w-3" />
                        {selectedDay !== "all" 
                          ? selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1) 
                          : "Full Week"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader className="bg-indigo-50 dark:bg-indigo-950">
                          <TableRow>
                            {selectedDay === "all" && <TableHead className="font-medium">Day</TableHead>}
                            <TableHead className="font-medium">Time</TableHead>
                            <TableHead className="font-medium">Teacher</TableHead>
                            <TableHead className="font-medium">Subject</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getFilteredTimetable().length > 0 ? (
                            getFilteredTimetable().map((slot, index) => (
                              <TableRow key={index} className="hover:bg-indigo-50/50 dark:hover:bg-indigo-950/50">
                                {selectedDay === "all" && (
                                  <TableCell className="capitalize font-medium">
                                    {slot.day}
                                  </TableCell>
                                )}
                                <TableCell className="whitespace-nowrap">
                                  <Badge variant="outline" className="text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700">
                                    {formatTimeDisplay(slot.startTime)} - {formatTimeDisplay(slot.endTime)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-indigo-600" />
                                    <span>{('teacher' in slot) ? slot.teacher : ''}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-indigo-600" />
                                    <span>{slot.subject}</span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={selectedDay === "all" ? 4 : 3} className="h-24 text-center">
                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                  <ClipboardList className="h-8 w-8 mb-2 opacity-40" />
                                  <p>No schedule found</p>
                                  <p className="text-sm">Select a different class or day, or add new slots</p>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="subjects" className="mt-0 p-4">
            <div className="flex items-center justify-center h-64 text-center p-4">
              <div className="space-y-3">
                <BookOpen className="h-12 w-12 mx-auto text-indigo-500 opacity-50" />
                <h3 className="text-xl font-medium">Subject Schedule</h3>
                <p className="text-muted-foreground max-w-md">
                  This view is coming soon. It will allow you to see and manage schedules by subject across all classes.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Add New Slot Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <div className="bg-indigo-100 p-2 rounded-full">
                <Plus className="h-5 w-5 text-indigo-600" />
              </div>
              <span>Add New Timetable Slot</span>
            </DialogTitle>
            <DialogDescription>
              Fill in the details to add a new slot to the timetable.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teacher-dialog" className="text-sm font-medium">
                  Teacher
                </Label>
                <Select 
                  value={newSlot.teacher}
                  onValueChange={(value) => setNewSlot({...newSlot, teacher: value})}
                >
                  <SelectTrigger id="teacher-dialog" className="bg-white dark:bg-gray-900">
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="class-dialog" className="text-sm font-medium">
                  Class
                </Label>
                <Select 
                  value={newSlot.class}
                  onValueChange={(value) => setNewSlot({...newSlot, class: value})}
                >
                  <SelectTrigger id="class-dialog" className="bg-white dark:bg-gray-900">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classItem) => (
                      <SelectItem key={classItem.id} value={classItem.name}>
                        Class {classItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject-dialog" className="text-sm font-medium">
                Subject
              </Label>
              <Select 
                value={newSlot.subject}
                onValueChange={(value) => setNewSlot({...newSlot, subject: value})}
              >
                <SelectTrigger id="subject-dialog" className="bg-white dark:bg-gray-900">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.name}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="day-dialog" className="text-sm font-medium">
                Day
              </Label>
              <Select 
                value={newSlot.day}
                onValueChange={(value) => setNewSlot({...newSlot, day: value})}
              >
                <SelectTrigger id="day-dialog" className="bg-white dark:bg-gray-900">
                  <SelectValue placeholder="Select a day" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time" className="text-sm font-medium">
                  Start Time
                </Label>
                <Input 
                  id="start-time" 
                  type="time" 
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
                  className="bg-white dark:bg-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time" className="text-sm font-medium">
                  End Time
                </Label>
                <Input 
                  id="end-time" 
                  type="time" 
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
                  className="bg-white dark:bg-gray-900"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddSlot}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Slot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Conflict Dialog */}
      <Dialog open={showConflictDialog} onOpenChange={setShowConflictDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2 text-red-600">
              <div className="bg-red-100 p-2 rounded-full">
                <X className="h-5 w-5 text-red-600" />
              </div>
              <span>Timetable Conflict Detected</span>
            </DialogTitle>
            <DialogDescription>
              This timeslot conflicts with the following existing entries:
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Card className="border-red-100">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-red-50">
                    <TableRow>
                      <TableHead className="font-medium">Day</TableHead>
                      <TableHead className="font-medium">Time</TableHead>
                      <TableHead className="font-medium">Class</TableHead>
                      <TableHead className="font-medium">Subject</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conflictingSlots.map((slot, index) => (
                      <TableRow key={index} className="hover:bg-red-50/50">
                        <TableCell className="capitalize font-medium">
                          {slot.day}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatTimeDisplay(slot.startTime)} - {formatTimeDisplay(slot.endTime)}
                        </TableCell>
                        <TableCell>
                          {('class' in slot) ? slot.class : ''}
                        </TableCell>
                        <TableCell>
                          {slot.subject}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConflictDialog(false)}
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            >
              Go Back and Edit
            </Button>
            <Button 
              onClick={() => {
                setShowConflictDialog(false);
                toast.success("New timeslot added with conflicts resolved");
                setShowAddDialog(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Override Conflict
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

// Statistics Card Component
function TimetableStatCard({ title, value, description, icon: Icon, color }: any) {
  const colorClasses = {
    indigo: "from-indigo-500 to-indigo-600 shadow-indigo-200/50 dark:shadow-indigo-900/20",
    purple: "from-purple-500 to-purple-600 shadow-purple-200/50 dark:shadow-purple-900/20",
    blue: "from-blue-500 to-blue-600 shadow-blue-200/50 dark:shadow-blue-900/20",
    pink: "from-pink-500 to-pink-600 shadow-pink-200/50 dark:shadow-pink-900/20",
  }
  
  return (
    <Card className="border-none shadow-lg overflow-hidden">
      <CardContent className={`p-0 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]}`}>
        <div className="flex items-center gap-4 p-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/80">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-white/70">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Timetable Page Loading Skeleton
function TimetablePageSkeleton() {
  return (
    <div className="space-y-6 py-5 px-4">
      <Skeleton className="h-[160px] w-full rounded-xl bg-gradient-to-r from-indigo-400/70 to-purple-400/70" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-[100px] w-full rounded-xl" />
        ))}
      </div>
      
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <Skeleton className="h-10 w-full flex-1" />
        <Skeleton className="h-10 w-[140px]" />
        <Skeleton className="h-10 w-[140px]" />
      </div>
      
      <Skeleton className="h-12 w-full rounded-t-xl" />
      <Skeleton className="h-[500px] w-full rounded-b-xl" />
    </div>
  )
} 