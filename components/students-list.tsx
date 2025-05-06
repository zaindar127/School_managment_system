"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, FileEdit, Search, Trash, Pencil } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { generatePDF } from "@/lib/pdf-generator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Cake } from "lucide-react"

export function StudentsList() {
  const [students, setStudents] = useState([
    {
      id: "1035",
      name: "Muhammad Muheeb",
      fatherName: "Muhammad Yameen",
      class: "Two",
      gender: "Male",
      phone: "03001234567",
      fee: "₹2,500",
      status: "Active",
      dateOfBirth: "2015-10-20",
    },
    {
      id: "1036",
      name: "Ayesha Khan",
      fatherName: "Imran Khan",
      class: "One",
      gender: "Female",
      phone: "03009876543",
      fee: "₹2,000",
      status: "Active",
      dateOfBirth: "2016-03-15",
    },
    {
      id: "1037",
      name: "Zainab Ali",
      fatherName: "Ali Hassan",
      class: "Three",
      gender: "Female",
      phone: "03331234567",
      fee: "₹3,000",
      status: "Active",
      dateOfBirth: "2014-08-25",
    },
    {
      id: "1038",
      name: "Ahmed Hassan",
      fatherName: "Hassan Ahmed",
      class: "Prep",
      gender: "Male",
      phone: "03211234567",
      fee: "₹1,800",
      status: "Active",
      dateOfBirth: "2017-12-05",
    },
    {
      id: "1039",
      name: "Fatima Zahra",
      fatherName: "Zahra Ali",
      class: "Four",
      gender: "Female",
      phone: "03451234567",
      fee: "₹3,500",
      status: "Inactive",
      dateOfBirth: "2013-06-30",
    },
  ])

  const [viewStudent, setViewStudent] = useState<any>(null)
  const [editStudent, setEditStudent] = useState<any>(null)
  const [deleteStudent, setDeleteStudent] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [classFilter, setClassFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("active")
  const [ageFilter, setAgeFilter] = useState<"all" | "under-5" | "5-10" | "over-10">("all")
  const [showBirthdayAlert, setShowBirthdayAlert] = useState(false)
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<any[]>([])

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  // Check for upcoming birthdays
  useEffect(() => {
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000))
    
    const birthdays = students.filter(student => {
      const birthday = new Date(student.dateOfBirth)
      birthday.setFullYear(today.getFullYear()) // Set to this year
      
      // If birthday has passed this year, check next year
      if (birthday < today) {
        birthday.setFullYear(today.getFullYear() + 1)
      }
      
      return birthday >= today && birthday <= thirtyDaysFromNow
    }).map(student => ({
      ...student,
      birthdayDate: new Date(student.dateOfBirth).setFullYear(today.getFullYear()),
    }))
    
    if (birthdays.length > 0) {
      setUpcomingBirthdays(birthdays)
      setShowBirthdayAlert(true)
    }
  }, [students])

  const handleView = (student: any) => {
    setViewStudent(student)
  }

  const handleEdit = (student: any) => {
    setEditStudent({ ...student })
  }

  const handleDelete = (student: any) => {
    setDeleteStudent(student)
  }

  const handleSaveEdit = () => {
    if (editStudent) {
      setStudents(students.map((s) => (s.id === editStudent.id ? editStudent : s)))
      setEditStudent(null)
    }
  }

  const handleConfirmDelete = () => {
    if (deleteStudent) {
      setStudents(students.filter((s) => s.id !== deleteStudent.id))
      setDeleteStudent(null)
    }
  }

  const handleGenerateStudentList = () => {
    generatePDF({
      title: "Student List",
      data: filteredStudents,
      columns: [
        { header: "ID", key: "id" },
        { header: "Name", key: "name" },
        { header: "Father's Name", key: "fatherName" },
        { header: "Class", key: "class" },
        { header: "Gender", key: "gender" },
        { header: "Phone", key: "phone" },
        { header: "Fee", key: "fee" },
        { header: "Status", key: "status" },
      ],
    })
  }

  // Filter students based on search term, class, status, and age
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesClass = classFilter === "all" || student.class.toLowerCase() === classFilter.toLowerCase()

    const matchesStatus = statusFilter === "all" || student.status.toLowerCase() === statusFilter.toLowerCase()

    const age = calculateAge(student.dateOfBirth)
    const matchesAge = ageFilter === "all" ||
      (ageFilter === "under-5" && age < 5) ||
      (ageFilter === "5-10" && age >= 5 && age <= 10) ||
      (ageFilter === "over-10" && age > 10)

    return matchesSearch && matchesClass && matchesStatus && matchesAge
  })

  return (
    <Card>
      <CardContent className="p-6">
        {showBirthdayAlert && upcomingBirthdays.length > 0 && (
          <Alert className="mb-6">
            <Cake className="h-4 w-4" />
            <AlertTitle>Upcoming Birthdays!</AlertTitle>
            <AlertDescription>
              {upcomingBirthdays.map((student, index) => (
                <div key={student.id} className="text-sm">
                  {student.name} - {new Date(student.birthdayDate).toLocaleDateString()}
                  {index < upcomingBirthdays.length - 1 ? ", " : ""}
                </div>
              ))}
            </AlertDescription>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={() => setShowBirthdayAlert(false)}
            >
              Dismiss
            </Button>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="nursery">Nursery</SelectItem>
              <SelectItem value="prep">Prep</SelectItem>
              <SelectItem value="one">One</SelectItem>
              <SelectItem value="two">Two</SelectItem>
              <SelectItem value="three">Three</SelectItem>
              <SelectItem value="four">Four</SelectItem>
              <SelectItem value="five">Five</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select 
            value={ageFilter} 
            onValueChange={(value) => {
              if (value === "all" || value === "under-5" || value === "5-10" || value === "over-10") {
                setAgeFilter(value)
              }
            }}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by age" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ages</SelectItem>
              <SelectItem value="under-5">Under 5 Years</SelectItem>
              <SelectItem value="5-10">5-10 Years</SelectItem>
              <SelectItem value="over-10">Over 10 Years</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleGenerateStudentList}>Generate PDF</Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Father's Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Birthday</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.fatherName}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>{calculateAge(student.dateOfBirth)} years</TableCell>
                    <TableCell>{new Date(student.dateOfBirth).toLocaleDateString()}</TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell>{student.fee}</TableCell>
                    <TableCell>
                      <Badge variant={student.status === "Active" ? "default" : "secondary"}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleView(student)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(student)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(student)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} className="text-center">
                    No students found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* View Student Dialog */}
      <Dialog open={!!viewStudent} onOpenChange={() => setViewStudent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>Detailed information about the student.</DialogDescription>
          </DialogHeader>
          {viewStudent && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Student ID</Label>
                  <div className="font-medium">{viewStudent.id}</div>
                </div>
                <div>
                  <Label>Name</Label>
                  <div className="font-medium">{viewStudent.name}</div>
                </div>
                <div>
                  <Label>Father's Name</Label>
                  <div className="font-medium">{viewStudent.fatherName}</div>
                </div>
                <div>
                  <Label>Class</Label>
                  <div className="font-medium">{viewStudent.class}</div>
                </div>
                <div>
                  <Label>Gender</Label>
                  <div className="font-medium">{viewStudent.gender}</div>
                </div>
                <div>
                  <Label>Phone</Label>
                  <div className="font-medium">{viewStudent.phone}</div>
                </div>
                <div>
                  <Label>Fee</Label>
                  <div className="font-medium">{viewStudent.fee}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge
                    variant="outline"
                    className={
                      viewStudent.status === "Active"
                        ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300"
                    }
                  >
                    {viewStudent.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewStudent(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={!!editStudent} onOpenChange={() => setEditStudent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Update student information.</DialogDescription>
          </DialogHeader>
          {editStudent && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editStudent.name}
                    onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-father">Father's Name</Label>
                  <Input
                    id="edit-father"
                    value={editStudent.fatherName}
                    onChange={(e) => setEditStudent({ ...editStudent, fatherName: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-class">Class</Label>
                  <Select
                    value={editStudent.class}
                    onValueChange={(value) => setEditStudent({ ...editStudent, class: value })}
                  >
                    <SelectTrigger id="edit-class">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nursery">Nursery</SelectItem>
                      <SelectItem value="Prep">Prep</SelectItem>
                      <SelectItem value="One">One</SelectItem>
                      <SelectItem value="Two">Two</SelectItem>
                      <SelectItem value="Three">Three</SelectItem>
                      <SelectItem value="Four">Four</SelectItem>
                      <SelectItem value="Five">Five</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-gender">Gender</Label>
                  <Select
                    value={editStudent.gender}
                    onValueChange={(value) => setEditStudent({ ...editStudent, gender: value })}
                  >
                    <SelectTrigger id="edit-gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={editStudent.phone}
                    onChange={(e) => setEditStudent({ ...editStudent, phone: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-fee">Fee</Label>
                  <Input
                    id="edit-fee"
                    value={editStudent.fee}
                    onChange={(e) => setEditStudent({ ...editStudent, fee: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editStudent.status}
                    onValueChange={(value) => setEditStudent({ ...editStudent, status: value })}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditStudent(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Student Dialog */}
      <AlertDialog open={!!deleteStudent} onOpenChange={() => setDeleteStudent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student
              {deleteStudent && ` ${deleteStudent.name}`} and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
