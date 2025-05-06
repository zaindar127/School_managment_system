"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, FileText, Search, ChevronDown } from "lucide-react"
import { generatePDF } from "@/lib/pdf-generator"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TeacherStudentsList({ className }: { className: string }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Dummy data for students in the class
  const students =
    className === "Two"
      ? [
          {
            id: "1035",
            name: "Muhammad Muheeb",
            fatherName: "Muhammad Yameen",
            rollNo: "05",
            attendance: "94%",
            performance: "Excellent",
            lastResult: "A+",
            contactNo: "0300-1234567",
            email: "muheeb@example.com",
            address: "123 Main Street, Islamabad",
            details: {
              gender: "Male",
              age: 12,
              subjects: ["Mathematics", "Science", "English", "Urdu", "Islamic Studies"],
              fees: "Paid",
            }
          },
          {
            id: "1042",
            name: "Ahmed Hassan",
            fatherName: "Hassan Ahmed",
            rollNo: "12",
            attendance: "88%",
            performance: "Good",
            lastResult: "B+",
            contactNo: "0300-7654321",
            email: "ahmed@example.com",
            address: "456 Park Avenue, Lahore",
            details: {
              gender: "Male",
              age: 13,
              subjects: ["Mathematics", "Science", "English", "Urdu", "Islamic Studies"],
              fees: "Paid",
            }
          },
          {
            id: "1056",
            name: "Ali Ahmed",
            fatherName: "Ahmed Ali",
            rollNo: "15",
            attendance: "76%",
            performance: "Average",
            lastResult: "C",
            contactNo: "0300-1111222",
            email: "ali@example.com",
            address: "789 Garden Town, Karachi",
            details: {
              gender: "Male", 
              age: 12,
              subjects: ["Mathematics", "Science", "English", "Urdu", "Islamic Studies"],
              fees: "Pending",
            }
          },
          {
            id: "1078",
            name: "Sara Khan",
            fatherName: "Imran Khan",
            rollNo: "22",
            attendance: "92%",
            performance: "Very Good",
            lastResult: "A",
            contactNo: "0300-3333444",
            email: "sara@example.com",
            address: "101 DHA Phase 5, Lahore",
            details: {
              gender: "Female", 
              age: 13,
              subjects: ["Mathematics", "Science", "English", "Urdu", "Islamic Studies"],
              fees: "Paid",
            }
          },
          {
            id: "1089",
            name: "Hassan Ali",
            fatherName: "Ali Hassan",
            rollNo: "25",
            attendance: "90%",
            performance: "Good",
            lastResult: "B+",
            contactNo: "0300-5555666",
            email: "hassan@example.com",
            address: "202 Model Town, Faisalabad",
            details: {
              gender: "Male", 
              age: 12,
              subjects: ["Mathematics", "Science", "English", "Urdu", "Islamic Studies"],
              fees: "Paid",
            }
          },
        ]
      : [
          {
            id: "1036",
            name: "Ayesha Khan",
            fatherName: "Imran Khan",
            rollNo: "03",
            attendance: "96%",
            performance: "Excellent",
            lastResult: "A+",
            contactNo: "0300-7777888",
            email: "ayesha@example.com",
            address: "303 Bahria Town, Rawalpindi",
            details: {
              gender: "Female", 
              age: 11,
              subjects: ["Mathematics", "Science", "English", "Urdu", "Islamic Studies"],
              fees: "Paid",
            }
          },
          {
            id: "1045",
            name: "Fatima Zahra",
            fatherName: "Zahra Ali",
            rollNo: "08",
            attendance: "90%",
            performance: "Very Good",
            lastResult: "A",
            contactNo: "0300-9999000",
            email: "fatima@example.com",
            address: "404 Johar Town, Lahore",
            details: {
              gender: "Female", 
              age: 11,
              subjects: ["Mathematics", "Science", "English", "Urdu", "Islamic Studies"],
              fees: "Pending",
            }
          },
          {
            id: "1058",
            name: "Zainab Ali",
            fatherName: "Ali Hassan",
            rollNo: "12",
            attendance: "85%",
            performance: "Good",
            lastResult: "B+",
            contactNo: "0300-2222111",
            email: "zainab@example.com",
            address: "505 Gulberg, Lahore",
            details: {
              gender: "Female", 
              age: 10,
              subjects: ["Mathematics", "Science", "English", "Urdu", "Islamic Studies"],
              fees: "Paid",
            }
          },
          {
            id: "1067",
            name: "Bilal Ahmed",
            fatherName: "Ahmed Bilal",
            rollNo: "15",
            attendance: "78%",
            performance: "Average",
            lastResult: "C+",
            contactNo: "0300-4444333",
            email: "bilal@example.com",
            address: "606 Valencia Town, Lahore",
            details: {
              gender: "Male", 
              age: 11,
              subjects: ["Mathematics", "Science", "English", "Urdu", "Islamic Studies"],
              fees: "Paid",
            }
          },
        ]

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.includes(searchQuery) ||
      student.fatherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.includes(searchQuery)
  )

  const handleGenerateClassList = () => {
    generatePDF({
      title: `Class ${className} - Student List`,
      data: students,
      columns: [
        { header: "ID", key: "id" },
        { header: "Name", key: "name" },
        { header: "Father's Name", key: "fatherName" },
        { header: "Roll No", key: "rollNo" },
        { header: "Attendance", key: "attendance" },
        { header: "Performance", key: "performance" },
        { header: "Last Result", key: "lastResult" },
      ],
    })
  }

  const handleViewStudent = (student: any) => {
    setSelectedStudent(student)
    setIsDialogOpen(true)
  }

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "Excellent":
        return "text-green-600"
      case "Very Good":
        return "text-blue-600"
      case "Good":
        return "text-sky-600"
      case "Average":
        return "text-amber-600"
      case "Poor":
        return "text-red-600"
      default:
        return ""
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-sm hover:shadow transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl font-bold">Class {className} Students</CardTitle>
            <CardDescription>List of students in your class</CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search students..."
                className="w-full bg-background pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  Export <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleGenerateClassList}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Father's Name</TableHead>
                  <TableHead className="w-[80px]">Roll No</TableHead>
                  <TableHead className="hidden md:table-cell">Attendance</TableHead>
                  <TableHead className="hidden md:table-cell">Performance</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <motion.tr 
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{student.id}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{student.fatherName}</TableCell>
                      <TableCell>{student.rollNo}</TableCell>
                      <TableCell className="hidden md:table-cell">{student.attendance}</TableCell>
                      <TableCell className={`hidden md:table-cell ${getPerformanceColor(student.performance)}`}>
                        {student.performance}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            student.lastResult === "A+" || student.lastResult === "A"
                              ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : student.lastResult === "B+" || student.lastResult === "B"
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          }
                        >
                          {student.lastResult}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleViewStudent(student)}
                          className="opacity-70 group-hover:opacity-100"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No students found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </CardContent>
      </Card>
            
      {selectedStudent && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Student Details</DialogTitle>
              <DialogDescription>
                Complete information about the student
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col md:flex-row gap-6 py-4">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-xl bg-primary/10 text-primary">
                    {selectedStudent.name.split(' ').map((word: string) => word[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-medium">{selectedStudent.name}</h3>
                  <p className="text-muted-foreground">ID: {selectedStudent.id}</p>
                  <Badge className="mt-2">{selectedStudent.details.gender}</Badge>
                </div>
              </div>
              
              <div className="flex-1">
                <Tabs defaultValue="basic">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="academic">Academic</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Father's Name</p>
                        <p className="font-medium">{selectedStudent.fatherName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Roll No</p>
                        <p className="font-medium">{selectedStudent.rollNo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Age</p>
                        <p className="font-medium">{selectedStudent.details.age} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Fees Status</p>
                        <Badge variant={selectedStudent.details.fees === "Paid" ? "outline" : "destructive"}>
                          {selectedStudent.details.fees}
                        </Badge>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="academic" className="space-y-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Performance</p>
                      <p className={`font-medium ${getPerformanceColor(selectedStudent.performance)}`}>
                        {selectedStudent.performance}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Attendance</p>
                      <p className="font-medium">{selectedStudent.attendance}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Result</p>
                      <Badge
                        variant="outline"
                        className={
                          selectedStudent.lastResult === "A+" || selectedStudent.lastResult === "A"
                            ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : selectedStudent.lastResult === "B+" || selectedStudent.lastResult === "B"
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                        }
                      >
                        {selectedStudent.lastResult}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Subjects</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedStudent.details.subjects.map((subject: string) => (
                          <Badge key={subject} variant="outline">{subject}</Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="contact" className="space-y-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedStudent.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Contact Number</p>
                      <p className="font-medium">{selectedStudent.contactNo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{selectedStudent.address}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  )
}
