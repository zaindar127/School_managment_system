"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  AlertCircle, 
  Calendar, 
  Check, 
  Clock, 
  CreditCard, 
  Download, 
  FileText, 
  Phone, 
  QrCode, 
  ReceiptText, 
  Upload 
} from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import Image from "next/image"
import { toast } from "sonner"

// Mock QR code image
const QR_CODE_IMG = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=HBL-Account-123456789"

export default function StudentFeePage() {
  const router = useRouter()
  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState("")
  
  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      setStudent(JSON.parse(userStr))
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-2xl font-bold">Session Expired</h1>
        <p className="text-muted-foreground">Please log in again to view your fees</p>
        <Button onClick={() => router.push("/login")}>Go to Login</Button>
      </div>
    )
  }

  // Generate dummy fee data based on student ID
  const generateFeeData = () => {
    // Use student ID to create different scenarios
    const hasPendingFee = student.id === "student1"
    
    const currentFees = [
      {
        id: "fee-001",
        type: "Tuition Fee",
        amount: 15000,
        dueDate: "2024-04-30",
        status: hasPendingFee ? "Pending" : "Paid",
        paidOn: hasPendingFee ? null : "2024-04-15",
        receiptNo: hasPendingFee ? null : "REC-24-0415",
      },
      {
        id: "fee-002",
        type: "Computer Lab Fee",
        amount: 2000,
        dueDate: "2024-04-30",
        status: "Pending",
        paidOn: null,
        receiptNo: null,
      },
      {
        id: "fee-003",
        type: "Examination Fee",
        amount: 3000,
        dueDate: "2024-05-15",
        status: "Pending",
        paidOn: null,
        receiptNo: null,
      }
    ]
    
    const feeHistory = [
      {
        id: "fee-h001",
        type: "Tuition Fee",
        amount: 15000,
        dueDate: "2024-03-31",
        status: "Paid",
        paidOn: "2024-03-25",
        receiptNo: "REC-24-0325",
      },
      {
        id: "fee-h002",
        type: "Computer Lab Fee",
        amount: 2000,
        dueDate: "2024-03-31",
        status: "Paid",
        paidOn: "2024-03-25",
        receiptNo: "REC-24-0325",
      },
      {
        id: "fee-h003",
        type: "Sports Fee",
        amount: 1500,
        dueDate: "2024-03-31",
        status: "Paid",
        paidOn: "2024-03-25",
        receiptNo: "REC-24-0325",
      }
    ]
    
    const pendingAmount = currentFees
      .filter(fee => fee.status === "Pending")
      .reduce((sum, fee) => sum + fee.amount, 0)
    
    const paymentMethods = [
      {
        type: "Bank Transfer",
        accountName: "School Management System",
        accountNumber: "12345-67890123-456",
        bankName: "HBL Bank",
        instructions: "Please include student name and ID in reference"
      },
      {
        type: "JazzCash",
        accountNumber: "0300-1234567",
        accountName: "School Finance",
        instructions: "Use student ID as reference"
      },
      {
        type: "EasyPaisa",
        accountNumber: "0301-9876543",
        accountName: "School Finance",
        instructions: "Use student ID as reference"
      }
    ]
    
    return {
      studentName: student.name,
      studentId: student.id === "student1" ? "1035" : "1036",
      class: student.class,
      currentFees,
      feeHistory,
      pendingAmount,
      hasPendingFee: pendingAmount > 0,
      paymentMethods
    }
  }
  
  const feeData = generateFeeData()
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }
  
  const handleUploadReceipt = () => {
    if (!selectedFile || !referenceNumber) {
      toast.error("Please select a file and enter a reference number")
      return
    }
    
    // In a real app, this would upload the file to a server
    toast.success("Receipt uploaded successfully! Awaiting verification.")
    setUploadDialogOpen(false)
    setSelectedFile(null)
    setReferenceNumber("")
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Paid</Badge>
      case "Pending":
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Pending</Badge>
      case "Overdue":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Overdue</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Fee Management</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back to Dashboard
        </Button>
      </div>
      
      {feeData.hasPendingFee && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-amber-800">You have pending fees</h3>
                <p className="text-amber-700 mt-1">
                  Total amount due: <strong>Rs. {feeData.pendingAmount.toLocaleString()}</strong>
                </p>
                <div className="flex gap-2 mt-4">
                  <Button className="bg-amber-600 hover:bg-amber-700" onClick={() => setUploadDialogOpen(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Payment Receipt
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Fee Details</CardTitle>
              <CardDescription>
                Current semester fees and payment status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left">Fee Type</th>
                      <th className="px-4 py-3 text-left">Amount</th>
                      <th className="px-4 py-3 text-left">Due Date</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Paid On</th>
                      <th className="px-4 py-3 text-left">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeData.currentFees.map((fee) => (
                      <tr key={fee.id} className="border-b">
                        <td className="px-4 py-4">{fee.type}</td>
                        <td className="px-4 py-4">Rs. {fee.amount.toLocaleString()}</td>
                        <td className="px-4 py-4">{fee.dueDate}</td>
                        <td className="px-4 py-4">{getStatusBadge(fee.status)}</td>
                        <td className="px-4 py-4">{fee.paidOn || "-"}</td>
                        <td className="px-4 py-4">
                          {fee.receiptNo ? (
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              <span className="text-xs">{fee.receiptNo}</span>
                            </Button>
                          ) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                Record of previous fee payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left">Fee Type</th>
                      <th className="px-4 py-3 text-left">Amount</th>
                      <th className="px-4 py-3 text-left">Due Date</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Paid On</th>
                      <th className="px-4 py-3 text-left">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeData.feeHistory.map((fee) => (
                      <tr key={fee.id} className="border-b">
                        <td className="px-4 py-4">{fee.type}</td>
                        <td className="px-4 py-4">Rs. {fee.amount.toLocaleString()}</td>
                        <td className="px-4 py-4">{fee.dueDate}</td>
                        <td className="px-4 py-4">{getStatusBadge(fee.status)}</td>
                        <td className="px-4 py-4">{fee.paidOn || "-"}</td>
                        <td className="px-4 py-4">
                          {fee.receiptNo && (
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              <span className="text-xs">{fee.receiptNo}</span>
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Student Name</p>
                <p className="font-medium">{feeData.studentName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Student ID</p>
                <p className="font-medium">{feeData.studentId}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Class</p>
                <p className="font-medium">{feeData.class}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Choose a method to pay your fees</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="bank">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="bank">Bank</TabsTrigger>
                  <TabsTrigger value="jazzcash">JazzCash</TabsTrigger>
                  <TabsTrigger value="easypaisa">EasyPaisa</TabsTrigger>
                </TabsList>
                
                {feeData.paymentMethods.map((method, index) => (
                  <TabsContent key={method.type} value={method.type.toLowerCase().replace(/\s+/g, '')}>
                    <div className="space-y-4 py-4">
                      {method.type === "Bank Transfer" && (
                        <div className="flex justify-center mb-6">
                          <div className="p-4 bg-white rounded-xl border">
                            <Image 
                              src={QR_CODE_IMG} 
                              alt="Bank Transfer QR Code" 
                              width={150} 
                              height={150}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                          {method.type === "Bank Transfer" ? (
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Phone className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div className="font-medium">{method.type}</div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Account Name</p>
                            <p className="text-sm font-medium">{method.accountName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Account Number</p>
                            <p className="text-sm font-medium">{method.accountNumber}</p>
                          </div>
                          {method.bankName && (
                            <div className="col-span-2">
                              <p className="text-xs text-muted-foreground">Bank</p>
                              <p className="text-sm font-medium">{method.bankName}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 text-sm bg-gray-50 p-3 rounded-md border">
                          <p className="font-medium mb-1">Instructions:</p>
                          <p className="text-muted-foreground">{method.instructions}</p>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={() => setUploadDialogOpen(true)}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Payment Receipt
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                If you have any questions about your fees or payments, please contact our finance office.
              </p>
              <div className="flex justify-between items-center">
                <Button variant="outline">Contact Finance Office</Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Fee Policy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Payment Receipt</DialogTitle>
            <DialogDescription>
              Please upload a clear image or PDF of your payment receipt
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="receipt-file">Payment Receipt</Label>
              <Input 
                id="receipt-file"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground">
                Accepted formats: JPG, PNG, PDF (Max 5MB)
              </p>
            </div>
            
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="reference-number">Payment Reference Number</Label>
              <Input 
                id="reference-number" 
                placeholder="e.g. Transaction ID or Receipt Number"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadReceipt}>
              <Check className="h-4 w-4 mr-2" />
              Submit Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
