"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, UserPlus, FileText, ChevronRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion } from "framer-motion"

export function RecentAdmissions() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const recentAdmissions = [
    {
      id: "1035",
      name: "Muhammad Muheeb",
      class: "Two",
      date: "2023-08-15",
      status: "Active",
      details: {
        father: "Muhammad Yameen",
        contactNo: "0300-1234567",
        address: "123 Main Street, Islamabad",
        gender: "Male",
        age: 12,
        feeStatus: "Paid"
      }
    },
    {
      id: "1036",
      name: "Ayesha Khan",
      class: "One",
      date: "2023-08-16",
      status: "Active",
      details: {
        father: "Imran Khan",
        contactNo: "0300-7654321",
        address: "456 Park Avenue, Lahore",
        gender: "Female",
        age: 11,
        feeStatus: "Pending"
      }
    },
    {
      id: "1037",
      name: "Zainab Ali",
      class: "Three",
      date: "2023-08-17",
      status: "Active",
      details: {
        father: "Ali Hassan",
        contactNo: "0300-2222111",
        address: "789 Garden Town, Karachi",
        gender: "Female",
        age: 10,
        feeStatus: "Paid"
      }
    },
    {
      id: "1038",
      name: "Ahmed Hassan",
      class: "Prep",
      date: "2023-08-18",
      status: "Active",
      details: {
        father: "Hassan Ahmed",
        contactNo: "0300-5555444",
        address: "101 DHA Phase 1, Lahore",
        gender: "Male",
        age: 9,
        feeStatus: "Paid"
      }
    },
  ]

  const filteredAdmissions = searchQuery 
    ? recentAdmissions.filter(student => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.includes(searchQuery) ||
        student.class.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recentAdmissions

  const handleViewDetails = (student: any) => {
    setSelectedStudent(student)
    setIsDialogOpen(true)
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
      case "Pending": return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
      case "Inactive": return "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300"
      default: return ""
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
            <CardTitle className="text-xl font-medium">Recent Admissions</CardTitle>
            <CardDescription>Latest student admissions in the school</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => window.location.href = "/dashboard/admin/students/admission"}>
            <UserPlus className="h-3.5 w-3.5" />
            <span>Add New</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search admissions..."
              className="w-full pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[70px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmissions.length > 0 ? (
                  filteredAdmissions.map((student, index) => (
                    <motion.tr 
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{student.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {student.name.split(' ').map((word: string) => word[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span>{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>Class {student.class}</TableCell>
                      <TableCell className="hidden md:table-cell">{student.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadgeClass(student.status)}>
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleViewDetails(student)}
                          className="opacity-70 group-hover:opacity-100"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No admissions found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredAdmissions.length} of {recentAdmissions.length} admissions
            </p>
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => window.location.href = "/students"}>
              <span>View All Students</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {selectedStudent && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Student Details</DialogTitle>
              <DialogDescription>
                Admission information for {selectedStudent.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg bg-primary/10 text-primary">
                    {selectedStudent.name.split(' ').map((word: string) => word[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{selectedStudent.name}</h3>
                  <p className="text-sm text-muted-foreground">ID: {selectedStudent.id}</p>
                  <Badge variant="outline" className={getStatusBadgeClass(selectedStudent.status)}>
                    {selectedStudent.status}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Class</p>
                  <p className="font-medium">Class {selectedStudent.class}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Admission Date</p>
                  <p className="font-medium">{selectedStudent.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Father's Name</p>
                  <p className="font-medium">{selectedStudent.details.father}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium">{selectedStudent.details.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">{selectedStudent.details.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fee Status</p>
                  <Badge variant={selectedStudent.details.feeStatus === "Paid" ? "outline" : "destructive"}>
                    {selectedStudent.details.feeStatus}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium">{selectedStudent.details.contactNo}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{selectedStudent.details.address}</p>
                </div>
              </div>
              
              <div className="flex justify-between mt-4 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
                <Button className="gap-2">
                  <FileText className="h-4 w-4" />
                  View Full Profile
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  )
}
