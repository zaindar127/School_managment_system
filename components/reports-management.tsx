"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Printer, FileText, Users, GraduationCap, Clipboard, FileBarChart, BadgeCheck, Calculator, Calendar, Clock, CreditCard, ChevronsUp, Briefcase, CircleDollarSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { generatePDF } from "@/lib/pdf-generator"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { ReportCard } from "./report-card"

export function ReportsManagement() {
  // Dummy data for reports
  const studentListData = [
    {
      id: "1035",
      name: "Muhammad Muheeb",
      fatherName: "Muhammad Yameen",
      class: "Two",
      gender: "Male",
      phone: "03001234567",
      status: "Active",
    },
    {
      id: "1036",
      name: "Ayesha Khan",
      fatherName: "Imran Khan",
      class: "One",
      gender: "Female",
      phone: "03009876543",
      status: "Active",
    },
    {
      id: "1037",
      name: "Zainab Ali",
      fatherName: "Ali Hassan",
      class: "Three",
      gender: "Female",
      phone: "03331234567",
      status: "Active",
    },
    {
      id: "1038",
      name: "Ahmed Hassan",
      fatherName: "Hassan Ahmed",
      class: "Prep",
      gender: "Male",
      phone: "03211234567",
      status: "Active",
    },
    {
      id: "1039",
      name: "Fatima Zahra",
      fatherName: "Zahra Ali",
      class: "Four",
      gender: "Female",
      phone: "03451234567",
      status: "Inactive",
    },
  ]

  const staffListData = [
    {
      id: "31",
      name: "Abdul Sattar",
      fatherName: "Muhammad Ali",
      designation: "Staff",
      salary: "₹11,000",
      gender: "Male",
      phone: "03090909286",
      status: "Active",
    },
    {
      id: "32",
      name: "Fatima Zahra",
      fatherName: "Zahra Ali",
      designation: "Teacher",
      salary: "₹15,000",
      gender: "Female",
      phone: "03451234567",
      status: "Active",
    },
    {
      id: "33",
      name: "Muhammad Ali",
      fatherName: "Ali Hassan",
      designation: "Teacher",
      salary: "₹15,000",
      gender: "Male",
      phone: "03331234567",
      status: "Active",
    },
    {
      id: "34",
      name: "Ayesha Bibi",
      fatherName: "Imran Khan",
      designation: "Admin",
      salary: "₹20,000",
      gender: "Female",
      phone: "03009876543",
      status: "Active",
    },
  ]

  const attendanceData = [
    { class: "Nursery", totalStudents: 20, present: 18, absent: 2, percentage: "90%" },
    { class: "Prep", totalStudents: 25, present: 22, absent: 3, percentage: "88%" },
    { class: "One", totalStudents: 30, present: 28, absent: 2, percentage: "93%" },
    { class: "Two", totalStudents: 25, present: 22, absent: 3, percentage: "88%" },
    { class: "Three", totalStudents: 28, present: 25, absent: 3, percentage: "89%" },
    { class: "Four", totalStudents: 30, present: 26, absent: 4, percentage: "87%" },
    { class: "Five", totalStudents: 25, present: 23, absent: 2, percentage: "92%" },
  ]

  const feeData = [
    { class: "Nursery", totalDue: "₹40,000", collected: "₹35,000", outstanding: "₹5,000", percentage: "88%" },
    { class: "Prep", totalDue: "₹50,000", collected: "₹45,000", outstanding: "₹5,000", percentage: "90%" },
    { class: "One", totalDue: "₹60,000", collected: "₹55,000", outstanding: "₹5,000", percentage: "92%" },
    { class: "Two", totalDue: "₹50,000", collected: "₹45,000", outstanding: "₹5,000", percentage: "90%" },
    { class: "Three", totalDue: "₹56,000", collected: "₹50,000", outstanding: "₹6,000", percentage: "89%" },
    { class: "Four", totalDue: "₹60,000", collected: "₹52,000", outstanding: "₹8,000", percentage: "87%" },
    { class: "Five", totalDue: "₹50,000", collected: "₹46,000", outstanding: "₹4,000", percentage: "92%" },
  ]

  const handleGenerateStudentList = () => {
    generatePDF({
      title: "Student List",
      data: studentListData,
      columns: [
        { header: "ID", key: "id" },
        { header: "Name", key: "name" },
        { header: "Father's Name", key: "fatherName" },
        { header: "Class", key: "class" },
        { header: "Gender", key: "gender" },
        { header: "Phone", key: "phone" },
        { header: "Status", key: "status" },
      ],
    })
  }

  const handleGenerateStaffList = () => {
    generatePDF({
      title: "Staff List",
      data: staffListData,
      columns: [
        { header: "ID", key: "id" },
        { header: "Name", key: "name" },
        { header: "Father's Name", key: "fatherName" },
        { header: "Designation", key: "designation" },
        { header: "Salary", key: "salary" },
        { header: "Gender", key: "gender" },
        { header: "Phone", key: "phone" },
        { header: "Status", key: "status" },
      ],
    })
  }

  const handleGenerateAttendanceReport = () => {
    generatePDF({
      title: "Attendance Summary Report",
      data: attendanceData,
      columns: [
        { header: "Class", key: "class" },
        { header: "Total Students", key: "totalStudents" },
        { header: "Present", key: "present" },
        { header: "Absent", key: "absent" },
        { header: "Percentage", key: "percentage" },
      ],
    })
  }

  const handleGenerateFeeReport = () => {
    generatePDF({
      title: "Fee Collection Summary Report",
      data: feeData,
      columns: [
        { header: "Class", key: "class" },
        { header: "Total Due", key: "totalDue" },
        { header: "Collected", key: "collected" },
        { header: "Outstanding", key: "outstanding" },
        { header: "Collection %", key: "percentage" },
      ],
    })
  }

  return (
    <Card className="shadow-md border-border overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b pb-4">
        <CardTitle className="flex items-center gap-2">
          <FileBarChart className="h-5 w-5 text-primary" />
          Reports
        </CardTitle>
        <CardDescription>Generate various reports for students, staff, attendance, and fees</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="students" className="flex items-center gap-1">
              <GraduationCap className="h-4 w-4" />
              <span>Students</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Staff</span>
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-1">
              <Clipboard className="h-4 w-4" />
              <span>Attendance</span>
            </TabsTrigger>
            <TabsTrigger value="finance" className="flex items-center gap-1">
              <Calculator className="h-4 w-4" />
              <span>Finance</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReportCard 
                title="Student List" 
                description="Generate a list of students with various filters"
                icon={FileText}
              >
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
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
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <RadioGroup defaultValue="all" className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all-students" />
                      <Label htmlFor="all-students">All</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="active" id="active-students" />
                      <Label htmlFor="active-students">Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="inactive" id="inactive-students" />
                      <Label htmlFor="inactive-students">Inactive</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Include Fields</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="id" defaultChecked />
                      <Label htmlFor="id">ID</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="name" defaultChecked />
                      <Label htmlFor="name">Name</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="father" defaultChecked />
                      <Label htmlFor="father">Father's Name</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="class" defaultChecked />
                      <Label htmlFor="class">Class</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="phone" defaultChecked />
                      <Label htmlFor="phone">Phone</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="address" />
                      <Label htmlFor="address">Address</Label>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary" onClick={handleGenerateStudentList}>
                  <Printer className="mr-2 h-4 w-4" />
                  Generate Student List
                </Button>
              </ReportCard>

              <ReportCard 
                title="Admission Form" 
                description="Print admission form for a specific student"
                icon={FileText}
              >
                <div className="space-y-2">
                  <Label>Student</Label>
                  <Select defaultValue="1035">
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1035">1035 - Muhammad Muheeb</SelectItem>
                      <SelectItem value="1042">1042 - Fatima Zahra</SelectItem>
                      <SelectItem value="1056">1056 - Ali Ahmed</SelectItem>
                      <SelectItem value="1078">1078 - Sara Khan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Include Sections</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="personal" defaultChecked />
                      <Label htmlFor="personal">Personal Information</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="contact" defaultChecked />
                      <Label htmlFor="contact">Contact Information</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="emergency" defaultChecked />
                      <Label htmlFor="emergency">Emergency Contact</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="siblings" />
                      <Label htmlFor="siblings">Siblings Information</Label>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary"
                  onClick={() => {
                    generatePDF({
                      title: "Student Admission Form",
                      data: [
                        { field: "Student ID", value: "1035" },
                        { field: "Name", value: "Muhammad Muheeb" },
                        { field: "Father's Name", value: "Muhammad Yameen" },
                        { field: "Date of Birth", value: "10/03/2015" },
                        { field: "Class", value: "Two" },
                        { field: "Admission Date", value: "15/04/2022" },
                        { field: "Phone", value: "03001234567" },
                        { field: "Address", value: "123 Main Street, City" },
                      ],
                      columns: [
                        { header: "Field", key: "field" },
                        { header: "Value", key: "value" },
                      ],
                    })
                  }}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print Admission Form
                </Button>
              </ReportCard>

              <ReportCard 
                title="Student ID Cards" 
                description="Generate ID cards for students"
                icon={FileText}
              >
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="nursery">Nursery</SelectItem>
                      <SelectItem value="prep">Prep</SelectItem>
                      <SelectItem value="one">One</SelectItem>
                      <SelectItem value="two">Two</SelectItem>
                      <SelectItem value="three">Three</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>ID Card Type</Label>
                  <RadioGroup defaultValue="standard" className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard">Standard</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="compact" id="compact" />
                      <Label htmlFor="compact">Compact</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary"
                  onClick={() => {
                    generatePDF({
                      title: "Student ID Cards",
                      data: studentListData.filter((s) => s.status === "Active"),
                      columns: [
                        { header: "ID", key: "id" },
                        { header: "Name", key: "name" },
                        { header: "Class", key: "class" },
                      ],
                    })
                  }}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Generate ID Cards
                </Button>
              </ReportCard>

              <ReportCard 
                title="Academic Reports" 
                description="Generate academic performance reports"
                icon={FileText}
              >
                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <Select defaultValue="result-card">
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="result-card">Result Cards</SelectItem>
                      <SelectItem value="class-result">Class Result Summary</SelectItem>
                      <SelectItem value="top-students">Top Students</SelectItem>
                      <SelectItem value="progress">Progress Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Class</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="nursery">Nursery</SelectItem>
                      <SelectItem value="prep">Prep</SelectItem>
                      <SelectItem value="one">One</SelectItem>
                      <SelectItem value="two">Two</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Term</Label>
                  <Select defaultValue="final">
                    <SelectTrigger>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="final">Final Term</SelectItem>
                      <SelectItem value="mid">Mid Term</SelectItem>
                      <SelectItem value="first">First Term</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary"
                  onClick={() => {
                    generatePDF({
                      title: "Academic Performance Report",
                      data: [
                        {
                          subject: "English Reading",
                          totalMarks: 100,
                          obtainedMarks: 90,
                          grade: "A+",
                          status: "Pass",
                        },
                        {
                          subject: "English Written",
                          totalMarks: 100,
                          obtainedMarks: 85,
                          grade: "A",
                          status: "Pass",
                        },
                        { subject: "Urdu Reading", totalMarks: 100, obtainedMarks: 95, grade: "A+", status: "Pass" },
                        { subject: "Urdu Written", totalMarks: 100, obtainedMarks: 88, grade: "A", status: "Pass" },
                        { subject: "Mathematics", totalMarks: 100, obtainedMarks: 92, grade: "A+", status: "Pass" },
                      ],
                      columns: [
                        { header: "Subject", key: "subject" },
                        { header: "Total Marks", key: "totalMarks" },
                        { header: "Obtained Marks", key: "obtainedMarks" },
                        { header: "Grade", key: "grade" },
                        { header: "Status", key: "status" },
                      ],
                    })
                  }}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Generate Academic Report
                </Button>
              </ReportCard>
            </div>
          </TabsContent>

          <TabsContent value="staff" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-border hover:shadow-md transition-all duration-300 hover:border-primary/20">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Staff List
                  </CardTitle>
                  <CardDescription>Generate a list of staff members with various filters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-5">
                  <div className="space-y-2">
                    <Label>Designation</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select designation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Designations</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="principal">Principal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <RadioGroup defaultValue="all" className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all-staff" />
                        <Label htmlFor="all-staff">All</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="active" id="active-staff" />
                        <Label htmlFor="active-staff">Active</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="inactive" id="inactive-staff" />
                        <Label htmlFor="inactive-staff">Inactive</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Include Fields</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="staff-id" defaultChecked />
                        <Label htmlFor="staff-id">ID</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="staff-name" defaultChecked />
                        <Label htmlFor="staff-name">Name</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="staff-father" defaultChecked />
                        <Label htmlFor="staff-father">Father's Name</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="staff-designation" defaultChecked />
                        <Label htmlFor="staff-designation">Designation</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="staff-phone" defaultChecked />
                        <Label htmlFor="staff-phone">Phone</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="staff-salary" defaultChecked />
                        <Label htmlFor="staff-salary">Salary</Label>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary" onClick={handleGenerateStaffList}>
                    <Printer className="mr-2 h-4 w-4" />
                    Generate Staff List
                  </Button>
                </CardContent>
              </Card>

              <Card className="border border-border hover:shadow-md transition-all duration-300 hover:border-primary/20">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Salary Sheets
                  </CardTitle>
                  <CardDescription>Generate salary sheets for staff members</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-5">
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Select defaultValue="april">
                      <SelectTrigger>
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="january">January</SelectItem>
                        <SelectItem value="february">February</SelectItem>
                        <SelectItem value="march">March</SelectItem>
                        <SelectItem value="april">April</SelectItem>
                        <SelectItem value="may">May</SelectItem>
                        <SelectItem value="june">June</SelectItem>
                        <SelectItem value="july">July</SelectItem>
                        <SelectItem value="august">August</SelectItem>
                        <SelectItem value="september">September</SelectItem>
                        <SelectItem value="october">October</SelectItem>
                        <SelectItem value="november">November</SelectItem>
                        <SelectItem value="december">December</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Select defaultValue="2024">
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Designation</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select designation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Designations</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary" onClick={() => {
                    generatePDF({
                      title: "Salary Sheet - April 2024",
                      data: staffListData,
                      columns: [
                        { header: "ID", key: "id" },
                        { header: "Name", key: "name" },
                        { header: "Designation", key: "designation" },
                        { header: "Salary", key: "salary" },
                      ],
                    })
                  }}>
                    <Printer className="mr-2 h-4 w-4" />
                    Generate Salary Sheets
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-border hover:shadow-md transition-all duration-300 hover:border-primary/20">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Daily Attendance
                  </CardTitle>
                  <CardDescription>Generate daily attendance reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-5">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                  </div>

                  <div className="space-y-2">
                    <Label>Class</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        <SelectItem value="nursery">Nursery</SelectItem>
                        <SelectItem value="prep">Prep</SelectItem>
                        <SelectItem value="one">One</SelectItem>
                        <SelectItem value="two">Two</SelectItem>
                        <SelectItem value="three">Three</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Report Format</Label>
                    <RadioGroup defaultValue="detailed" className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="detailed" id="detailed" />
                        <Label htmlFor="detailed">Detailed</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="summary" id="summary" />
                        <Label htmlFor="summary">Summary</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary" onClick={handleGenerateAttendanceReport}>
                    <Printer className="mr-2 h-4 w-4" />
                    Generate Attendance Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="border border-border hover:shadow-md transition-all duration-300 hover:border-primary/20">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Monthly Attendance
                  </CardTitle>
                  <CardDescription>Generate monthly attendance reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-5">
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Select defaultValue="april">
                      <SelectTrigger>
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="january">January</SelectItem>
                        <SelectItem value="february">February</SelectItem>
                        <SelectItem value="march">March</SelectItem>
                        <SelectItem value="april">April</SelectItem>
                        <SelectItem value="may">May</SelectItem>
                        <SelectItem value="june">June</SelectItem>
                        <SelectItem value="july">July</SelectItem>
                        <SelectItem value="august">August</SelectItem>
                        <SelectItem value="september">September</SelectItem>
                        <SelectItem value="october">October</SelectItem>
                        <SelectItem value="november">November</SelectItem>
                        <SelectItem value="december">December</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Select defaultValue="2024">
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Class</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        <SelectItem value="nursery">Nursery</SelectItem>
                        <SelectItem value="prep">Prep</SelectItem>
                        <SelectItem value="one">One</SelectItem>
                        <SelectItem value="two">Two</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary" onClick={handleGenerateAttendanceReport}>
                    <Printer className="mr-2 h-4 w-4" />
                    Generate Monthly Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="finance" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-border hover:shadow-md transition-all duration-300 hover:border-primary/20">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Fee Collection
                  </CardTitle>
                  <CardDescription>Generate fee collection reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-5">
                  <div className="space-y-2">
                    <Label>Period</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">From</Label>
                        <Input type="date" defaultValue="2024-04-01" />
                      </div>
                      <div>
                        <Label className="text-xs">To</Label>
                        <Input type="date" defaultValue="2024-04-30" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Fee Type</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="monthly">Monthly Fee</SelectItem>
                        <SelectItem value="admission">Admission Fee</SelectItem>
                        <SelectItem value="exam">Exam Fee</SelectItem>
                        <SelectItem value="transport">Transport Fee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary" onClick={handleGenerateFeeReport}>
                    <Printer className="mr-2 h-4 w-4" />
                    Generate Fee Collection Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="border border-border hover:shadow-md transition-all duration-300 hover:border-primary/20">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    Outstanding Fees
                  </CardTitle>
                  <CardDescription>Generate reports for outstanding fees</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-5">
                  <div className="space-y-2">
                    <Label>Class</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        <SelectItem value="nursery">Nursery</SelectItem>
                        <SelectItem value="prep">Prep</SelectItem>
                        <SelectItem value="one">One</SelectItem>
                        <SelectItem value="two">Two</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Fee Type</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="monthly">Monthly Fee</SelectItem>
                        <SelectItem value="admission">Admission Fee</SelectItem>
                        <SelectItem value="exam">Exam Fee</SelectItem>
                        <SelectItem value="transport">Transport Fee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Sort By</Label>
                    <RadioGroup defaultValue="amount" className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="amount" id="amount" />
                        <Label htmlFor="amount">Amount</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="date" id="date" />
                        <Label htmlFor="date">Due Date</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary" onClick={handleGenerateFeeReport}>
                    <Printer className="mr-2 h-4 w-4" />
                    Generate Outstanding Fees Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
