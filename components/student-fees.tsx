"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Calendar, CreditCard, Download, DollarSign, FileText, MoreHorizontal, Receipt } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { format } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function StudentFees({ studentId }: { studentId: string }) {
  const [loading, setLoading] = useState(true)
  const [selectedFeeId, setSelectedFeeId] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1200)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Mock data for student fees
  const feeRecords = [
    {
      id: "FEE-2023-001",
      type: "Monthly Tuition",
      dueDate: "2023-01-15",
      amount: "PKR 5,000",
      status: "Paid",
      paymentDate: "2023-01-10"
    },
    {
      id: "FEE-2023-002",
      type: "Monthly Tuition",
      dueDate: "2023-02-15",
      amount: "PKR 5,000",
      status: "Paid",
      paymentDate: "2023-02-12"
    },
    {
      id: "FEE-2023-003",
      type: "Exam Fee",
      dueDate: "2023-03-05",
      amount: "PKR 1,500",
      status: "Paid",
      paymentDate: "2023-03-01"
    },
    {
      id: "FEE-2023-004",
      type: "Monthly Tuition",
      dueDate: "2023-03-15",
      amount: "PKR 5,000",
      status: "Overdue",
      paymentDate: null
    },
    {
      id: "FEE-2023-005",
      type: "Monthly Tuition",
      dueDate: "2023-04-15",
      amount: "PKR 5,000",
      status: "Pending",
      paymentDate: null
    },
    {
      id: "FEE-2023-006",
      type: "Annual Sports Fee",
      dueDate: "2023-04-30",
      amount: "PKR 3,000",
      status: "Pending",
      paymentDate: null
    },
  ]
  
  const handlePayment = () => {
    if (!selectedFeeId || !paymentAmount) return
    
    // Here you would normally make an API call to process the payment
    
    toast.success("Payment processed successfully", {
      description: `Payment of ${paymentAmount} processed via ${paymentMethod === 'card' ? 'Credit Card' : 'Bank Transfer'}.`,
      action: {
        label: "View Receipt",
        onClick: () => console.log("View receipt clicked"),
      },
    })
    
    // Close the modal and reset form
    setShowPaymentModal(false)
    setPaymentAmount("")
    setPaymentMethod("card")
    setSelectedFeeId(null)
  }
  
  // Calculate summary statistics
  const totalFees = feeRecords.reduce((sum, record) => 
    sum + parseInt(record.amount.replace(/\D/g, '')), 0)
    
  const paidFees = feeRecords
    .filter(record => record.status === "Paid")
    .reduce((sum, record) => sum + parseInt(record.amount.replace(/\D/g, '')), 0)
    
  const pendingFees = feeRecords
    .filter(record => record.status === "Pending" || record.status === "Overdue")
    .reduce((sum, record) => sum + parseInt(record.amount.replace(/\D/g, '')), 0)
    
  const overdueFees = feeRecords
    .filter(record => record.status === "Overdue")
    .reduce((sum, record) => sum + parseInt(record.amount.replace(/\D/g, '')), 0)
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/20">
            <CardTitle className="text-sm font-medium flex items-center text-green-800 dark:text-green-300">
              <DollarSign className="h-4 w-4 mr-1" />
              Total Fees Paid
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">PKR {paidFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((paidFees / totalFees) * 100).toFixed(0)}% of total fees
            </p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950/40 dark:to-yellow-900/20">
            <CardTitle className="text-sm font-medium flex items-center text-yellow-800 dark:text-yellow-300">
              <Calendar className="h-4 w-4 mr-1" />
              Pending Fees
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">PKR {(pendingFees - overdueFees).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {(((pendingFees - overdueFees) / totalFees) * 100).toFixed(0)}% of total fees
            </p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/40 dark:to-red-900/20">
            <CardTitle className="text-sm font-medium flex items-center text-red-800 dark:text-red-300">
              <AlertCircle className="h-4 w-4 mr-1" />
              Overdue Fees
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">PKR {overdueFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((overdueFees / totalFees) * 100).toFixed(0)}% of total fees
            </p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/20">
            <CardTitle className="text-sm font-medium flex items-center text-blue-800 dark:text-blue-300">
              <FileText className="h-4 w-4 mr-1" />
              Total Fee Amount
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">PKR {totalFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              For academic year 2023-24
            </p>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Fee transactions table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-medium">Fee Transactions</CardTitle>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-3.5 w-3.5" /> 
                <span>Download</span>
              </Button>
            </div>
            <CardDescription>
              Complete record of your fee payments and pending dues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Fee ID</TableHead>
                    <TableHead>Fee Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeRecords.map((fee, index) => (
                    <motion.tr 
                      key={fee.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`group hover:bg-muted/50 cursor-pointer ${
                        fee.status === "Overdue" 
                          ? "bg-red-50/40 dark:bg-red-900/10" 
                          : ""
                      }`}
                    >
                      <TableCell className="font-medium">{fee.id}</TableCell>
                      <TableCell>{fee.type}</TableCell>
                      <TableCell>{format(new Date(fee.dueDate), "MMM d, yyyy")}</TableCell>
                      <TableCell className="font-semibold">{fee.amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            fee.status === "Paid"
                              ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-200"
                              : fee.status === "Pending"
                                ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200"
                                : "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300 border-red-200"
                          }
                        >
                          <span className="flex items-center">
                            <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                              fee.status === "Paid" 
                                ? "bg-green-500" 
                                : fee.status === "Pending" 
                                  ? "bg-yellow-500" 
                                  : "bg-red-500"
                            }`}></span>
                            {fee.status}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {fee.paymentDate 
                          ? format(new Date(fee.paymentDate), "MMM d, yyyy")
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Fee Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {fee.status !== "Paid" ? (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedFeeId(fee.id)
                                  setPaymentAmount(fee.amount.replace("PKR ", ""))
                                  setShowPaymentModal(true)
                                }}
                              >
                                <CreditCard className="h-4 w-4 mr-2" />
                                Pay Fee
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <Receipt className="h-4 w-4 mr-2" />
                                View Receipt
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Showing {feeRecords.length} transactions
            </p>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Make a Payment</DialogTitle>
            <DialogDescription>
              Complete your fee payment through our secure payment gateway.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fee-id">Fee ID</Label>
              <Input id="fee-id" value={selectedFeeId || ""} readOnly className="bg-muted" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (PKR)</Label>
              <Input 
                id="amount" 
                value={paymentAmount} 
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount" 
              />
            </div>
            <div className="grid gap-2">
              <Label>Payment Method</Label>
              <div className="flex gap-4">
                <div 
                  className={`flex-1 border rounded-md p-3 cursor-pointer flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'card' 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:border-muted-foreground/20'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard className={`h-5 w-5 ${paymentMethod === 'card' ? 'text-primary' : ''}`} />
                  <span className="text-sm">Credit Card</span>
                </div>
                <div 
                  className={`flex-1 border rounded-md p-3 cursor-pointer flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'bank' 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:border-muted-foreground/20'
                  }`}
                  onClick={() => setPaymentMethod('bank')}
                >
                  <Receipt className={`h-5 w-5 ${paymentMethod === 'bank' ? 'text-primary' : ''}`} />
                  <span className="text-sm">Bank Transfer</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
            <Button onClick={handlePayment}>Process Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
