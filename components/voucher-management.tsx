"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Printer, Save, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"

const formSchema = z.object({
  voucherNumber: z.string().min(1, "Voucher number is required"),
  voucherType: z.string().min(1, "Voucher type is required"),
  studentId: z.string().optional(),
  studentName: z.string().optional(),
  amount: z.string().min(1, "Amount is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  description: z.string().optional(),
})

export function VoucherManagement() {
  const [showVoucher, setShowVoucher] = useState(false)
  const [voucherData, setVoucherData] = useState<z.infer<typeof formSchema> | null>(null)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      voucherNumber: "V-1001",
      voucherType: "sales",
      studentId: "",
      studentName: "",
      amount: "",
      description: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Store the voucher data and show the voucher
    setVoucherData(values)
    setShowVoucher(true)
    // In a real app, this would also submit to the backend
  }

  // Dummy data for recent vouchers
  const recentVouchers = [
    {
      id: "V-1000",
      type: "Sales",
      date: "2023-08-15",
      student: "Muhammad Muheeb",
      amount: "₹2,500",
    },
    {
      id: "V-999",
      type: "Sales",
      date: "2023-08-14",
      student: "Ayesha Khan",
      amount: "₹2,000",
    },
    {
      id: "V-998",
      type: "Purchase",
      date: "2023-08-13",
      student: "N/A",
      amount: "₹15,000",
    },
    {
      id: "V-997",
      type: "Sales",
      date: "2023-08-12",
      student: "Ali Ahmed",
      amount: "₹2,000",
    },
    {
      id: "V-996",
      type: "Sales",
      date: "2023-08-11",
      student: "Sara Khan",
      amount: "₹3,000",
    },
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Voucher Management</CardTitle>
          <CardDescription>Generate and manage vouchers for various transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="new" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new">New Voucher</TabsTrigger>
              <TabsTrigger value="recent">Recent Vouchers</TabsTrigger>
            </TabsList>

            <TabsContent value="new" className="space-y-4 pt-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="voucherNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Voucher Number</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="voucherType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Voucher Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select voucher type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sales">Sales</SelectItem>
                              <SelectItem value="purchase">Purchase</SelectItem>
                              <SelectItem value="payment">Payment</SelectItem>
                              <SelectItem value="receipt">Receipt</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="studentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student ID (if applicable)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="studentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student Name (if applicable)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline">
                      <Printer className="mr-2 h-4 w-4" />
                      Print Voucher
                    </Button>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Generate Voucher
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="recent">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Voucher #</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentVouchers.map((voucher) => (
                      <TableRow key={voucher.id}>
                        <TableCell>{voucher.id}</TableCell>
                        <TableCell>{voucher.type}</TableCell>
                        <TableCell>{voucher.date}</TableCell>
                        <TableCell>{voucher.student}</TableCell>
                        <TableCell>{voucher.amount}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Voucher Display Dialog */}
      <Dialog open={showVoucher} onOpenChange={setShowVoucher}>
        <DialogContent className="max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Voucher {voucherData?.voucherNumber}</span>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </DialogTitle>
            <DialogDescription>
              Generated on {new Date().toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          {voucherData && (
            <div className="border rounded-lg p-6 my-4 bg-white">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-2xl font-bold text-center text-gray-800 uppercase mb-2">
                  {voucherData.voucherType.charAt(0).toUpperCase() + voucherData.voucherType.slice(1)} Voucher
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Voucher No.</p>
                    <p className="font-medium">{voucherData.voucherNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{voucherData.date?.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                {voucherData.studentId && voucherData.studentName && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Student Details</p>
                    <p className="font-medium">{voucherData.studentName} ({voucherData.studentId})</p>
                  </div>
                )}
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="font-medium">{voucherData.description || "N/A"}</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Amount</span>
                    <span className="text-xl font-bold">₹{voucherData.amount}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500">Issued By</p>
                  <p className="font-medium">School Administrator</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Signature</p>
                  <p className="font-medium italic">_________________</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => {
                window.print();
              }}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Voucher
            </Button>
            <Button onClick={() => setShowVoucher(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
