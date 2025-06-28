"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, FileText, Printer, ArrowLeft, User, Phone, MapPin, Pencil, GraduationCap, BookOpen, Calendar, DollarSign, BadgeCheck, Receipt, CreditCard, Plus, Download } from "lucide-react"
import { toast } from "sonner"
import { generatePDF } from "@/lib/pdf-generator"
import { motion } from "framer-motion"

export default function StudentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [student, setStudent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching student data
    const fetchData = () => {
      // This would be an API call in a real application
      const studentId = params.id as string

      // Dummy data
      const students = [
        {
          id: "1035",
          name: "Muhammad Muheeb",
          fatherName: "Muhammad Yameen",
          class: "Two",
          gender: "Male",
          phone: "03001234567",
          fee: "₹2,500",
          status: "Active",
          rollNo: "05",
          admissionDate: "2022-04-15",
          dateOfBirth: "2015-10-20",
          address: "123 Main Street, City",
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
          rollNo: "12",
          admissionDate: "2022-05-10",
          dateOfBirth: "2016-03-15",
          address: "456 Park Avenue, City",
        },
      ]

      const foundStudent = students.find((s) => s.id === studentId)

      if (foundStudent) {
        setStudent(foundStudent)
      } else {
        toast.error("Student not found", {
          description: "The requested student could not be found.",
        })
        router.push("/students")
      }

      setIsLoading(false)
    }

    fetchData()
  }, [params.id, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading student information...</p>
        </div>
      </div>
    )
  }

  if (!student) {
    return null
  }

  const handleGenerateReport = () => {
    generatePDF({
      title: `Student Report - ${student.name}`,
      data: [
        { field: "Student ID", value: student.id },
        { field: "Name", value: student.name },
        { field: "Father's Name", value: student.fatherName },
        { field: "Class", value: student.class },
        { field: "Roll No", value: student.rollNo },
        { field: "Gender", value: student.gender },
        { field: "Phone", value: student.phone },
        { field: "Fee", value: student.fee },
        { field: "Status", value: student.status },
        { field: "Admission Date", value: student.admissionDate },
        { field: "Date of Birth", value: student.dateOfBirth },
        { field: "Address", value: student.address },
      ],
      columns: [
        { header: "Field", key: "field" },
        { header: "Value", key: "value" },
      ],
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => router.back()} className="h-9 w-9 rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Student Profile</h1>
              <p className="text-muted-foreground">View and manage student information</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/students/${student.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <Button onClick={handleGenerateReport} className="bg-blue-600 hover:bg-blue-700">
              <Printer className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-1"
        >
          <Card className="overflow-hidden border-none shadow-md">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-24"></div>
            <CardContent className="relative pt-0 pb-6">
              <div className="flex justify-center -mt-12 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-1 shadow-md">
                  <div className="bg-white dark:bg-gray-900 h-24 w-24 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {student.name.charAt(0) + (student.name.split(' ')[1]?.[0] || '')}
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">{student.name}</h2>
                <p className="text-muted-foreground">Class {student.class} - Roll #{student.rollNo}</p>
                <Badge variant={student.status === "Active" ? "default" : "destructive"} className={`mt-2 ${student.status === "Active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30" : ""}`}>
                  {student.status}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b pb-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Father's Name</span>
                    <span className="font-medium">{student.fatherName}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 border-b pb-3">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full">
                    <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Student ID</span>
                    <span className="font-medium">{student.id}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 border-b pb-3">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                    <Phone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Phone Number</span>
                    <span className="font-medium">{student.phone}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                    <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Address</span>
                    <span className="font-medium truncate block">{student.address}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-3"
        >
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900/50 dark:to-blue-900/20 pb-4">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-blue-100/50 dark:bg-blue-900/20">
                  <TabsTrigger value="personal" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    <User className="mr-2 h-4 w-4" /> Personal Details
                  </TabsTrigger>
                  <TabsTrigger value="academic" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    <BookOpen className="mr-2 h-4 w-4" /> Academic Records
                  </TabsTrigger>
                  <TabsTrigger value="financial" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                    <DollarSign className="mr-2 h-4 w-4" /> Financial Records
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-6">
              <TabsContent value="personal" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <User className="mr-2 h-4 w-4 text-blue-500" /> 
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground block">Gender</span>
                          <p className="font-medium">{student.gender}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground block pt-2">Date of Birth</span>
                          <p className="font-medium">{student.dateOfBirth}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground block">Full Address</span>
                        <p className="font-medium">{student.address}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-blue-500" /> 
                        Enrollment Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground block">Admission Date</span>
                          <p className="font-medium">{student.admissionDate}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground block">Class</span>
                          <p className="font-medium">Class {student.class}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground block">Roll Number</span>
                          <p className="font-medium">{student.rollNo}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground block">Status</span>
                          <p className={`font-medium ${student.status === "Active" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                            {student.status}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-blue-500" /> 
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground block">Phone Number</span>
                        <p className="font-medium">{student.phone}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground block">Emergency Contact</span>
                        <p className="font-medium">Not provided</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Contact Information
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="academic" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10">
                      <CardTitle className="text-lg flex items-center">
                        <GraduationCap className="mr-2 h-4 w-4 text-green-600" /> 
                        Academic Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 gap-y-4">
                        <div>
                          <span className="text-sm text-muted-foreground block">English</span>
                          <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">A+</Badge>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground block">Mathematics</span>
                          <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">A</Badge>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground block">Science</span>
                          <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">A+</Badge>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground block">Social Studies</span>
                          <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium">B+</Badge>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Overall GPA</span>
                          <span className="font-bold text-green-600 dark:text-green-400">3.9/4.0</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full" style={{ width: '95%' }}></div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/20">
                      <Button variant="ghost" className="w-full">
                        <FileText className="mr-2 h-4 w-4" />
                        View Detailed Report Card
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10">
                      <CardTitle className="text-lg flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-purple-600" /> 
                        Attendance Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <span className="text-green-600 dark:text-green-400 text-2xl font-bold block">88%</span>
                          <span className="text-sm text-muted-foreground">Present</span>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <span className="text-yellow-600 dark:text-yellow-400 text-2xl font-bold block">8%</span>
                          <span className="text-sm text-muted-foreground">Late</span>
                        </div>
                        <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <span className="text-red-600 dark:text-red-400 text-2xl font-bold block">4%</span>
                          <span className="text-sm text-muted-foreground">Absent</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Last 30 Days</span>
                          <span className="text-sm font-medium">Total Days: 22</span>
                        </div>
                        <div className="w-full flex h-3 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full" style={{ width: '88%' }}></div>
                          <div className="bg-yellow-500 h-full" style={{ width: '8%' }}></div>
                          <div className="bg-red-500 h-full" style={{ width: '4%' }}></div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/20">
                      <Button variant="ghost" className="w-full">
                        <Calendar className="mr-2 h-4 w-4" />
                        View Full Attendance Record
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                <Card className="shadow-sm">
                  <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10">
                    <CardTitle className="text-lg flex items-center">
                      <BookOpen className="mr-2 h-4 w-4 text-blue-600" /> 
                      Current Courses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { name: "English Literature", teacher: "Ms. Fatima", schedule: "Mon/Wed 9:00 AM" },
                        { name: "Mathematics", teacher: "Mr. Ahmed", schedule: "Tue/Thu 10:30 AM" },
                        { name: "Science", teacher: "Ms. Zainab", schedule: "Mon/Fri 11:45 AM" },
                      ].map((course, i) => (
                        <Card key={i} className="shadow-sm">
                          <CardContent className="p-4">
                            <h4 className="font-medium">{course.name}</h4>
                            <p className="text-sm text-muted-foreground">{course.teacher}</p>
                            <Badge variant="outline" className="mt-2 bg-blue-50 dark:bg-blue-900/20">
                              {course.schedule}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="financial" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 border-none shadow-sm">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
                        <h4 className="text-lg font-medium">Monthly Fee</h4>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400 my-1">{student.fee}</p>
                        <p className="text-sm text-muted-foreground">Due on 5th of every month</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border-none shadow-sm">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <BadgeCheck className="h-8 w-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                        <h4 className="text-lg font-medium">Payment Status</h4>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 my-1">Paid</p>
                        <p className="text-sm text-muted-foreground">For current month</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 border-none shadow-sm">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                        <h4 className="text-lg font-medium">Last Payment</h4>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 my-1">April 5</p>
                        <p className="text-sm text-muted-foreground">Via Bank Transfer</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Receipt className="mr-2 h-4 w-4 text-blue-500" /> 
                      Recent Fee Transactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr className="text-left">
                            <th className="p-3 font-medium">Date</th>
                            <th className="p-3 font-medium">Description</th>
                            <th className="p-3 font-medium">Method</th>
                            <th className="p-3 font-medium text-right">Amount</th>
                            <th className="p-3 font-medium text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { date: "2023-04-05", desc: "April Monthly Fee", method: "Bank Transfer", amount: student.fee, status: "Paid" },
                            { date: "2023-03-03", desc: "March Monthly Fee", method: "Cash", amount: student.fee, status: "Paid" },
                            { date: "2023-02-05", desc: "February Monthly Fee", method: "Bank Transfer", amount: student.fee, status: "Paid" },
                          ].map((transaction, i) => (
                            <tr key={i} className="border-t">
                              <td className="p-3">{transaction.date}</td>
                              <td className="p-3">{transaction.desc}</td>
                              <td className="p-3">{transaction.method}</td>
                              <td className="p-3 text-right">{transaction.amount}</td>
                              <td className="p-3 text-right">
                                <Badge variant={transaction.status === "Paid" ? "default" : "destructive"} className={transaction.status === "Paid" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30" : ""}>
                                  {transaction.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/20 flex justify-between">
                    <Button variant="ghost">
                      <Download className="mr-2 h-4 w-4" />
                      Download Statement
                    </Button>
                    <Button variant="ghost">
                      <Printer className="mr-2 h-4 w-4" />
                      Print Receipt
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <CreditCard className="mr-2 h-4 w-4 text-blue-500" /> 
                      Payment Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center p-4 border rounded-lg">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-4">
                          <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">Bank Transfer</h4>
                          <p className="text-sm text-muted-foreground">Primary payment method</p>
                        </div>
                        <Badge>Default</Badge>
                      </div>
                      
                      <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Payment Method
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
