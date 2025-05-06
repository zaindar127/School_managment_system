"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Printer, Plus, Filter, Trash2, Edit, Check, X, DollarSign, FileText } from "lucide-react"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function FeeManagement() {
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [classFilter, setClassFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedFeeType, setSelectedFeeType] = useState<any>(null)
  const [isAddingFeeType, setIsAddingFeeType] = useState(false)
  const [newFeeType, setNewFeeType] = useState({
    name: "",
    description: "",
    amount: ""
  })

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1200)
    
    return () => clearTimeout(timer)
  }, [])

  // Dummy data for fee records
  const feeRecords = [
    {
      id: "1035",
      name: "Muhammad Muheeb",
      class: "Two",
      feeType: "Monthly",
      amount: "PKR 2,500",
      paid: "PKR 2,500",
      balance: "PKR 0",
      status: "Paid",
    },
    {
      id: "1042",
      name: "Fatima Zahra",
      class: "Three",
      feeType: "Monthly",
      amount: "PKR 2,500",
      paid: "PKR 0",
      balance: "PKR 2,500",
      status: "Pending",
    },
    {
      id: "1056",
      name: "Ali Ahmed",
      class: "One",
      feeType: "Monthly",
      amount: "PKR 2,000",
      paid: "PKR 2,000",
      balance: "PKR 0",
      status: "Paid",
    },
    {
      id: "1078",
      name: "Sara Khan",
      class: "Four",
      feeType: "Monthly",
      amount: "PKR 3,000",
      paid: "PKR 1,500",
      balance: "PKR 1,500",
      status: "Partial",
    },
    {
      id: "1089",
      name: "Hassan Ali",
      class: "Two",
      feeType: "Monthly",
      amount: "PKR 2,500",
      paid: "PKR 2,500",
      balance: "PKR 0",
      status: "Paid",
    },
  ]

  // Dummy data for fee types
  const [feeTypes, setFeeTypes] = useState([
    {
      id: "1",
      name: "Monthly Fee",
      description: "Regular monthly tuition fee",
      amount: "PKR 2,500",
    },
    {
      id: "2",
      name: "Admission Fee",
      description: "One-time admission fee",
      amount: "PKR 5,000",
    },
    {
      id: "3",
      name: "Exam Fee",
      description: "Term examination fee",
      amount: "PKR 1,000",
    },
    {
      id: "4",
      name: "Transport Fee",
      description: "Monthly transport service fee",
      amount: "PKR 1,500",
    },
  ])

  // Filter fee records based on search term and filters
  const filteredFeeRecords = feeRecords.filter(record => {
    const matchesSearch = 
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesClass = classFilter === "all" || 
      record.class.toLowerCase() === classFilter.toLowerCase()
      
    const matchesStatus = statusFilter === "all" || 
      record.status.toLowerCase() === statusFilter.toLowerCase()
      
    return matchesSearch && matchesClass && matchesStatus
  })

  const handleAddFeeType = () => {
    if (!newFeeType.name || !newFeeType.description || !newFeeType.amount) {
      toast.error("Please fill all fields");
      return;
    }
    
    const newId = (feeTypes.length + 1).toString();
    const feeType = {
      id: newId,
      name: newFeeType.name,
      description: newFeeType.description,
      amount: newFeeType.amount.startsWith("PKR") ? newFeeType.amount : `PKR ${newFeeType.amount}`,
    };
    
    setFeeTypes([...feeTypes, feeType]);
    setNewFeeType({ name: "", description: "", amount: "" });
    setIsAddingFeeType(false);
    
    toast.success("Fee type added successfully");
  }

  const handleDeleteFeeType = (id: string) => {
    setFeeTypes(feeTypes.filter(type => type.id !== id));
    toast.success("Fee type deleted successfully");
  }

  // Loading skeleton
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-6" />
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
          <Skeleton className="h-64 w-full rounded-md" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Fee Management</CardTitle>
          <CardDescription>Manage student fees, payments, and balances</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="collection" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="collection" className="text-base">
                <FileText className="h-4 w-4 mr-2" />
                Fee Collection
              </TabsTrigger>
              <TabsTrigger value="types" className="text-base">
                <DollarSign className="h-4 w-4 mr-2" />
                Fee Types
              </TabsTrigger>
              <TabsTrigger value="reports" className="text-base">
                <Printer className="h-4 w-4 mr-2" />
                Fee Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="collection" className="space-y-4 pt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="search" 
                      placeholder="Search by student name or ID..." 
                      className="pl-8" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select 
                    defaultValue="all" 
                    value={classFilter}
                    onValueChange={setClassFilter}
                  >
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
                  <Select 
                    defaultValue="all"
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-primary/5">
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Fee Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFeeRecords.length > 0 ? (
                        filteredFeeRecords.map((record, index) => (
                          <motion.tr
                            key={`fee-record-${record.id}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className={`group hover:bg-muted/50 ${
                              record.status === "Pending" 
                                ? "bg-red-50 dark:bg-red-900/10" 
                                : record.status === "Partial" 
                                  ? "bg-yellow-50 dark:bg-yellow-900/10" 
                                  : ""
                            }`}
                          >
                            <TableCell className="font-medium">{record.id}</TableCell>
                            <TableCell>{record.name}</TableCell>
                            <TableCell>{record.class}</TableCell>
                            <TableCell>{record.feeType}</TableCell>
                            <TableCell>{record.amount}</TableCell>
                            <TableCell>{record.paid}</TableCell>
                            <TableCell>{record.balance}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  record.status === "Paid"
                                    ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                                    : record.status === "Pending"
                                      ? "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300"
                                      : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                }
                              >
                                {record.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                      if (record.status !== "Paid") {
                                        toast.success(`Payment collected for ${record.name}`)
                                      } else {
                                        toast.info("This fee is already paid")
                                      }
                                    }}
                                  >
                                    Collect
                                  </Button>
                                </motion.div>
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => toast.success("Receipt printed successfully")}
                                  >
                                    <Printer className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center space-y-3">
                              <Search className="h-8 w-8 text-muted-foreground opacity-40" />
                              <div className="text-muted-foreground">
                                No matching fee records found
                              </div>
                              {searchTerm || classFilter !== "all" || statusFilter !== "all" ? (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setSearchTerm("")
                                    setClassFilter("all")
                                    setStatusFilter("all")
                                  }}
                                >
                                  Clear filters
                                </Button>
                              ) : null}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="types" className="space-y-4 pt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-end mb-4">
                  <Dialog open={isAddingFeeType} onOpenChange={setIsAddingFeeType}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Fee Type
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add New Fee Type</DialogTitle>
                        <DialogDescription>
                          Create a new fee type for your school. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="fee-name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="fee-name"
                            placeholder="e.g. Monthly Fee"
                            className="col-span-3"
                            value={newFeeType.name}
                            onChange={(e) => setNewFeeType({...newFeeType, name: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="fee-description" className="text-right">
                            Description
                          </Label>
                          <Input
                            id="fee-description"
                            placeholder="Brief description"
                            className="col-span-3"
                            value={newFeeType.description}
                            onChange={(e) => setNewFeeType({...newFeeType, description: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="fee-amount" className="text-right">
                            Amount
                          </Label>
                          <Input
                            id="fee-amount"
                            placeholder="e.g. 2,500"
                            className="col-span-3"
                            value={newFeeType.amount}
                            onChange={(e) => setNewFeeType({...newFeeType, amount: e.target.value})}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddingFeeType(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddFeeType}>
                          Save Fee Type
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader className="bg-primary/5">
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feeTypes.map((type, index) => (
                        <motion.tr 
                          key={`fee-type-${type.id}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="group hover:bg-muted/50"
                        >
                          <TableCell>{type.id}</TableCell>
                          <TableCell>{type.name}</TableCell>
                          <TableCell>{type.description}</TableCell>
                          <TableCell>{type.amount}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedFeeType(type);
                                    toast.info(`Editing ${type.name} (not implemented)`);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDeleteFeeType(type.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4 pt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <DollarSign className="h-5 w-5 mr-2 text-primary" />
                          Fee Collection Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground">Total Due:</span>
                            <span className="font-medium">PKR 12,500</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground">Total Collected:</span>
                            <span className="font-medium text-green-600">PKR 8,500</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground">Total Outstanding:</span>
                            <span className="font-medium text-red-600">PKR 4,000</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-muted-foreground">Collection Rate:</span>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">68%</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-primary" />
                          Generate Reports
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex flex-col space-y-2">
                            <span className="text-sm font-medium">Select Report Type</span>
                            <Select defaultValue="collection">
                              <SelectTrigger>
                                <SelectValue placeholder="Select report type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="collection">Fee Collection</SelectItem>
                                <SelectItem value="outstanding">Outstanding Fees</SelectItem>
                                <SelectItem value="class">Class-wise Collection</SelectItem>
                                <SelectItem value="student">Student Fee Ledger</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <Button 
                              className="w-full bg-primary"
                              onClick={() => toast.success("Report generated successfully")}
                            >
                              <Printer className="mr-2 h-4 w-4" />
                              Generate Report
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
