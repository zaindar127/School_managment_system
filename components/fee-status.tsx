"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DonutChart } from "@tremor/react"
import { Check, Clock, DollarSign, Download, Calendar, Search, AlertCircle, CreditCard, ChevronDown, Filter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export function FeeStatus() {
  const [period, setPeriod] = useState<string>("monthly")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  
  interface FeeRecord {
    id: string
    studentName: string
    class: string
    amount: number
    status: "paid" | "pending" | "overdue"
    dueDate: string
    paymentDate?: string
    paymentMethod?: string
  }
  
  const feeData = {
    monthly: {
      total: 25000,
      collected: 19500,
      pending: 3000,
      overdue: 2500,
      records: [
        {
          id: "FEE-001",
          studentName: "Ahmed Ali",
          class: "Three",
          amount: 2500,
          status: "paid",
          dueDate: "2023-10-15",
          paymentDate: "2023-10-10",
          paymentMethod: "Bank Transfer"
        },
        {
          id: "FEE-002",
          studentName: "Sara Khan",
          class: "Two",
          amount: 2000,
          status: "paid",
          dueDate: "2023-10-15",
          paymentDate: "2023-10-12",
          paymentMethod: "Cash"
        },
        {
          id: "FEE-003",
          studentName: "Hassan Ahmed",
          class: "One",
          amount: 1500,
          status: "pending",
          dueDate: "2023-10-15"
        },
        {
          id: "FEE-004",
          studentName: "Amina Malik",
          class: "Prep",
          amount: 1000,
          status: "overdue",
          dueDate: "2023-09-30"
        },
        {
          id: "FEE-005",
          studentName: "Usman Ali",
          class: "Nursery",
          amount: 800,
          status: "paid",
          dueDate: "2023-10-15",
          paymentDate: "2023-10-14",
          paymentMethod: "Credit Card"
        }
      ] as FeeRecord[]
    },
    quarterly: {
      total: 75000,
      collected: 60000,
      pending: 10000,
      overdue: 5000,
      records: [
        {
          id: "FEE-Q001",
          studentName: "Ahmed Ali",
          class: "Three",
          amount: 7500,
          status: "paid",
          dueDate: "2023-09-30",
          paymentDate: "2023-09-25",
          paymentMethod: "Bank Transfer"
        },
        {
          id: "FEE-Q002",
          studentName: "Sara Khan",
          class: "Two",
          amount: 6000,
          status: "paid",
          dueDate: "2023-09-30",
          paymentDate: "2023-09-28",
          paymentMethod: "Cash"
        },
        {
          id: "FEE-Q003",
          studentName: "Hassan Ahmed",
          class: "One",
          amount: 4500,
          status: "pending",
          dueDate: "2023-09-30"
        },
        {
          id: "FEE-Q004",
          studentName: "Amina Malik",
          class: "Prep",
          amount: 3000,
          status: "overdue",
          dueDate: "2023-08-31"
        },
        {
          id: "FEE-Q005",
          studentName: "Usman Ali",
          class: "Nursery",
          amount: 2400,
          status: "paid",
          dueDate: "2023-09-30",
          paymentDate: "2023-09-29",
          paymentMethod: "Credit Card"
        }
      ] as FeeRecord[]
    },
    annual: {
      total: 250000,
      collected: 220000,
      pending: 20000,
      overdue: 10000,
      records: [
        {
          id: "FEE-A001",
          studentName: "Ahmed Ali",
          class: "Three",
          amount: 25000,
          status: "paid",
          dueDate: "2023-04-30",
          paymentDate: "2023-04-20",
          paymentMethod: "Bank Transfer"
        },
        {
          id: "FEE-A002",
          studentName: "Sara Khan",
          class: "Two",
          amount: 20000,
          status: "paid",
          dueDate: "2023-04-30",
          paymentDate: "2023-04-25",
          paymentMethod: "Cash"
        },
        {
          id: "FEE-A003",
          studentName: "Hassan Ahmed",
          class: "One",
          amount: 15000,
          status: "pending",
          dueDate: "2023-04-30"
        },
        {
          id: "FEE-A004",
          studentName: "Amina Malik",
          class: "Prep",
          amount: 10000,
          status: "overdue",
          dueDate: "2022-12-31"
        },
        {
          id: "FEE-A005",
          studentName: "Usman Ali",
          class: "Nursery",
          amount: 8000,
          status: "paid",
          dueDate: "2023-04-30",
          paymentDate: "2023-04-28",
          paymentMethod: "Credit Card"
        }
      ] as FeeRecord[]
    }
  }
  
  const currentData = feeData[period as keyof typeof feeData]

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date)
  }
  
  // Filter records based on search query
  const filteredRecords = currentData.records.filter(record => 
    record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.id.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Donut chart data
  const chartdata = [
    {
      name: "Collected",
      value: currentData.collected,
      color: "emerald",
    },
    {
      name: "Pending",
      value: currentData.pending,
      color: "amber",
    },
    {
      name: "Overdue",
      value: currentData.overdue,
      color: "rose",
    },
  ]
  
  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
            <Check className="mr-1 h-3 w-3" /> Paid
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle className="mr-1 h-3 w-3" /> Overdue
          </Badge>
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-4 w-60" />
          </div>
          <Skeleton className="h-10 w-[300px]" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <div className="flex flex-col space-y-4">
                <Skeleton className="h-44 w-full rounded-lg" />
                <Skeleton className="h-28 w-full rounded-lg" />
              </div>
            </div>
            <div className="lg:col-span-8">
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-10 w-60" />
                <Skeleton className="h-10 w-40" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((_, index) => (
                  <Skeleton key={index} className="h-24 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </div>
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
      <Card className="shadow-sm hover:shadow transition-all duration-200 overflow-hidden">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            <CardTitle className="text-xl font-medium relative inline-block">
              Fee Status
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-primary/70 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Calendar className="mr-1 h-3.5 w-3.5" />
              {period === "monthly" ? "Monthly fee collection" : 
               period === "quarterly" ? "Quarterly fee collection" : "Annual fee collection"}
            </CardDescription>
          </div>
          <Tabs value={period} onValueChange={setPeriod} className="w-[300px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
              <TabsTrigger value="annual">Annual</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <div className="flex flex-col space-y-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={period}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  >
                    <DonutChart
                      data={chartdata}
                      variant="pie"
                      valueFormatter={(value: number) => formatCurrency(value)}
                      showAnimation={true}
                      showTooltip={true}
                      colors={["emerald", "amber", "rose"]}
                      className="h-44"
                    />
                  </motion.div>
                </AnimatePresence>
                
                <motion.div className="grid grid-cols-1 gap-3 mt-2" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Card className="bg-primary/5 border-none hover:bg-primary/10 transition-colors duration-300">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Total</p>
                          <p className="text-lg font-bold">{formatCurrency(currentData.total)}</p>
                        </div>
                        <DollarSign className="h-6 w-6 text-primary opacity-80" />
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-none hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors duration-300">
                        <CardContent className="p-3 flex flex-col">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-muted-foreground">Collected</p>
                            <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                            {Math.round((currentData.collected / currentData.total) * 100)}%
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Card className="bg-amber-50 dark:bg-amber-900/20 border-none hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors duration-300">
                        <CardContent className="p-3 flex flex-col">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-muted-foreground">Pending</p>
                            <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <p className="text-base font-bold text-amber-600 dark:text-amber-400 mt-1">
                            {Math.round((currentData.pending / currentData.total) * 100)}%
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Card className="bg-rose-50 dark:bg-rose-900/20 border-none hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors duration-300">
                        <CardContent className="p-3 flex flex-col">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-muted-foreground">Overdue</p>
                            <AlertCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                          </div>
                          <p className="text-base font-bold text-rose-600 dark:text-rose-400 mt-1">
                            {Math.round((currentData.overdue / currentData.total) * 100)}%
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
            
            <div className="lg:col-span-8">
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-60">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by name or class..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Filter className="h-3.5 w-3.5" />
                        <span>Filter</span>
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Show All</DropdownMenuItem>
                      <DropdownMenuItem>Paid Only</DropdownMenuItem>
                      <DropdownMenuItem>Pending Only</DropdownMenuItem>
                      <DropdownMenuItem>Overdue Only</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button size="sm" variant="outline" className="gap-1">
                    <Download className="h-3.5 w-3.5" />
                    <span>Export</span>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record, index) => (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="group"
                      >
                        <motion.div
                          whileHover={{
                            scale: 1.01,
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          className={`border rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4 ${
                            record.status === 'overdue' 
                              ? 'border-red-200 bg-red-50/30 dark:bg-red-900/10' 
                              : record.status === 'pending'
                                ? 'border-yellow-200 bg-yellow-50/30 dark:bg-yellow-900/10'
                                : 'hover:border-green-200 hover:bg-green-50/30 dark:hover:bg-green-900/10'
                          }`}
                        >
                          <div className="flex flex-col gap-2">
                            <div className="flex items-start gap-2">
                              <p className="font-semibold">{record.studentName}</p>
                              <Badge variant="outline" className="text-xs">Class {record.class}</Badge>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground gap-2">
                              <span className="text-xs bg-muted px-2 py-0.5 rounded">{record.id}</span>
                              <span>•</span>
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Due: {formatDate(record.dueDate)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:items-end gap-2">
                            <div className="flex items-center gap-3">
                              <p className="font-bold">{formatCurrency(record.amount)}</p>
                              {getStatusBadge(record.status)}
                            </div>
                            {record.status === "paid" && (
                              <div className="text-xs text-muted-foreground flex items-center">
                                <CreditCard className="h-3 w-3 mr-1" />
                                {record.paymentMethod} • {formatDate(record.paymentDate || "")}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-10 w-10 text-muted-foreground/50" />
                        No records found for your search query.
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSearchQuery("")}
                          className="mt-2"
                        >
                          Clear search
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredRecords.length} of {currentData.records.length} records
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="outline" size="sm">
              View All Records
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
} 