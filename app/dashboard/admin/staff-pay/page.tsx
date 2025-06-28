"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Users, 
  DollarSign, 
  Calendar, 
  CreditCard,
  Search,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileText,
  Printer
} from "lucide-react"
import { toast } from "sonner"

// Simplified teacher data with only essential attributes
const TEACHERS = [
  {
    id: "T001",
    name: "Ali Raza",
    salary: 48000,
    status: "paid"
  },
  {
    id: "T002",
    name: "Sara Khan",
    salary: 36500,
    status: "paid"
  },
  {
    id: "T003",
    name: "Bilal Ahmed",
    salary: 33300,
    status: "pending"
  },
  {
    id: "T004",
    name: "Fatima Zahra",
    salary: 44700,
    status: "paid"
  },
  {
    id: "T005",
    name: "Zainab Ali",
    salary: 31000,
    status: "pending"
  }
]

export default function StaffPayPage() {
  const [tab, setTab] = useState("current")
  const [selectedMonth, setSelectedMonth] = useState("January")
  const [selectedYear, setSelectedYear] = useState("2024")
  const [searchQuery, setSearchQuery] = useState("")
  const [teachers, setTeachers] = useState(TEACHERS)

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const years = ["2024", "2023", "2022", "2021", "2020"]

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const paidCount = teachers.filter(t => t.status === "paid").length
  const pendingCount = teachers.filter(t => t.status === "pending").length
  const totalSalary = teachers.reduce((sum, t) => sum + t.salary, 0)

  const statusBadge = (status: string) => {
    if (status === "paid") return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</Badge>
    if (status === "pending") return <Badge className="bg-amber-50 text-amber-700 border border-amber-200">Pending</Badge>
    return <Badge className="bg-slate-50 text-slate-700 border border-slate-200">Unknown</Badge>
  }

  const markAsPaid = (teacherId: string) => {
    setTeachers(prev => prev.map(t => t.id === teacherId ? { ...t, status: "paid" } : t))
    toast.success("Payment marked as paid")
  }

  const printPayslip = (teacher: any) => {
    // Simulate printing payslip
    const payslipData = {
      teacherId: teacher.id,
      teacherName: teacher.name,
      month: selectedMonth,
      year: selectedYear,
      salary: teacher.salary,
      paymentDate: new Date().toLocaleDateString(),
      status: teacher.status
    }
    
    // In a real app, this would open a print dialog or generate PDF
    console.log("Printing payslip:", payslipData)
    
    // Create a new window with payslip content
    const payslipWindow = window.open('', '_blank')
    if (payslipWindow) {
      payslipWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Payslip - ${teacher.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .payslip { border: 1px solid #ccc; padding: 20px; max-width: 600px; margin: 0 auto; }
            .row { display: flex; justify-content: space-between; margin: 10px 0; }
            .label { font-weight: bold; }
            .value { text-align: right; }
            .total { border-top: 2px solid #333; padding-top: 10px; font-weight: bold; font-size: 18px; }
            @media print { body { margin: 0; } .payslip { border: none; } }
          </style>
        </head>
        <body>
          <div class="payslip">
            <div class="header">
              <h1>SCHOOL MANAGEMENT SYSTEM</h1>
              <h2>PAYSLIP</h2>
            </div>
            <div class="row">
              <span class="label">Employee ID:</span>
              <span class="value">${teacher.id}</span>
            </div>
            <div class="row">
              <span class="label">Employee Name:</span>
              <span class="value">${teacher.name}</span>
            </div>
            <div class="row">
              <span class="label">Pay Period:</span>
              <span class="value">${selectedMonth} ${selectedYear}</span>
            </div>
            <div class="row">
              <span class="label">Payment Date:</span>
              <span class="value">${payslipData.paymentDate}</span>
            </div>
            <div class="row">
              <span class="label">Status:</span>
              <span class="value">${teacher.status.toUpperCase()}</span>
            </div>
            <div class="row total">
              <span class="label">Net Salary:</span>
              <span class="value">₹${teacher.salary.toLocaleString()}</span>
            </div>
            <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
              This is a computer generated payslip. No signature required.
            </div>
          </div>
          <script>window.print();</script>
        </body>
        </html>
      `)
      payslipWindow.document.close()
    }
    
    toast.success(`Payslip printed for ${teacher.name}`)
  }

  const viewDetails = (teacher: any) => {
    // Simulate viewing teacher details
    const details = {
      id: teacher.id,
      name: teacher.name,
      salary: teacher.salary,
      status: teacher.status,
      month: selectedMonth,
      year: selectedYear
    }
    
    console.log("Viewing details:", details)
    
    // Show details in a toast or could open a modal
    toast.success(`Viewing details for ${teacher.name}`, {
      description: `Salary: ₹${teacher.salary.toLocaleString()} | Status: ${teacher.status}`
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
            <CreditCard className="h-32 w-32 sm:h-64 sm:w-64 -mt-10 -mr-10 sm:-mt-20 sm:-mr-20 text-gray-400" />
          </motion.div>
        </div>
        
        <div className="relative z-10">
          <Badge className="bg-white/80 text-gray-700 border border-gray-200 hover:bg-white px-3 py-1 mb-3">
            <Calendar className="h-3 w-3 mr-1" /> {selectedMonth} {selectedYear}
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-800 mb-2">
            Teacher Payroll Management
          </h1>
          <p className="text-gray-600 max-w-2xl text-sm sm:text-base">
            Track teacher salary payments, manage payroll records, and maintain payment history for all teaching staff.
          </p>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2 rounded-lg">
                <Users className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                <p className="text-2xl font-bold text-gray-800">{teachers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Paid This Month</p>
                <p className="text-2xl font-bold text-gray-800">{paidCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-800">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2 rounded-lg">
                <DollarSign className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Salary</p>
                <p className="text-2xl font-bold text-gray-800">₹{totalSalary.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="w-full max-w-md mb-6 bg-gray-100">
          <TabsTrigger value="current" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">Current Month</TabsTrigger>
          <TabsTrigger value="history" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-0">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2 bg-gray-50 px-3 sm:px-4 py-2 rounded-lg border border-gray-200 w-full lg:w-auto">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              <span className="font-medium text-gray-700 text-sm sm:text-base">Payroll Period: {selectedMonth} {selectedYear}</span>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs border border-emerald-200">
                  {paidCount} Paid
                </span>
                <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-xs border border-amber-200">
                  {pendingCount} Pending
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
              
              <div className="flex gap-2">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[120px] border border-gray-200 bg-white text-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => (
                      <SelectItem key={month} value={month}>{month}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[100px] border border-gray-200 bg-white text-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-0">
              <div className="rounded-md border border-gray-200 overflow-x-auto">
                <div className="bg-gray-50 p-3 sm:p-4 grid grid-cols-12 gap-2 sm:gap-4 font-medium text-gray-700 border-b border-gray-200 min-w-[800px]">
                  <div className="col-span-1 flex justify-center text-xs sm:text-sm">#</div>
                  <div className="col-span-4 text-xs sm:text-sm">Teacher Name</div>
                  <div className="col-span-3 text-xs sm:text-sm">Salary</div>
                  <div className="col-span-2 text-xs sm:text-sm">Status</div>
                  <div className="col-span-2 text-right text-xs sm:text-sm">Actions</div>
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
                            <AvatarImage src="/placeholder-user.jpg" alt={teacher.name} />
                            <AvatarFallback className="bg-gray-100 text-gray-600 text-xs sm:text-sm">{teacher.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-800 text-xs sm:text-sm">{teacher.name}</p>
                            <p className="text-xs text-gray-500">ID: {teacher.id}</p>
                          </div>
                        </div>
                        <div className="col-span-3 text-xs sm:text-sm text-gray-600">₹{teacher.salary.toLocaleString()}</div>
                        <div className="col-span-2">
                          {statusBadge(teacher.status)}
                        </div>
                        <div className="col-span-2 flex justify-end gap-1">
                          {teacher.status === "pending" ? (
                            <Button 
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                              onClick={() => markAsPaid(teacher.id)}
                            >
                              <CheckCircle className="mr-1 h-3 w-3" /> Mark Paid
                            </Button>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Button 
                                size="sm"
                                variant="outline"
                                className="border-gray-200 bg-white hover:bg-gray-50 text-gray-600 text-xs"
                                onClick={() => viewDetails(teacher)}
                              >
                                <Eye className="mr-1 h-3 w-3" /> View
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                                className="border-gray-200 bg-white hover:bg-gray-50 text-gray-600 text-xs"
                                onClick={() => printPayslip(teacher)}
                              >
                                <Printer className="mr-1 h-3 w-3" /> Print
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2 bg-gray-50 px-3 sm:px-4 py-2 rounded-lg border border-gray-200 w-full lg:w-auto">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              <span className="font-medium text-gray-700 text-sm sm:text-base">Payment History</span>
              <span className="bg-slate-50 text-slate-700 px-2 py-0.5 rounded text-xs border border-slate-200">
                0 Records
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  type="text" 
                  placeholder="Search records..." 
                  className="pl-9 bg-white border-gray-200 focus:border-gray-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button variant="outline" className="border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
                <Download className="h-4 w-4 mr-2" />Export
              </Button>
            </div>
          </div>

          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-8 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No Payment History</p>
              <p className="text-sm">Payment history will appear here once payments are processed.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 