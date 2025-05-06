"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { DollarSign, Download, Filter, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function FeeSummary() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1200)
    
    return () => clearTimeout(timer)
  }, [])
  
  const feeSummary = [
    {
      id: "1035",
      name: "Muhammad Muheeb",
      class: "Two",
      feeType: "Monthly",
      amount: "PKR 2,500",
      status: "Paid",
    },
    {
      id: "1042",
      name: "Fatima Zahra",
      class: "Three",
      feeType: "Monthly",
      amount: "PKR 2,500",
      status: "Pending",
    },
    {
      id: "1056",
      name: "Ali Ahmed",
      class: "One",
      feeType: "Monthly",
      amount: "PKR 2,000",
      status: "Paid",
    },
    {
      id: "1078",
      name: "Sara Khan",
      class: "Four",
      feeType: "Monthly",
      amount: "PKR 3,000",
      status: "Overdue",
    },
    {
      id: "1089",
      name: "Hassan Ali",
      class: "Two",
      feeType: "Monthly",
      amount: "PKR 2,500",
      status: "Paid",
    },
  ]
  
  const filteredRecords = feeSummary.filter(record => {
    const matchesSearch = searchQuery === "" || 
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase())
      
    const matchesStatus = statusFilter === "all" || 
      record.status.toLowerCase() === statusFilter.toLowerCase()
      
    return matchesSearch && matchesStatus
  })
  
  // Calculate stats
  const totalAmount = feeSummary.reduce((sum, record) => {
    return sum + parseInt(record.amount.replace(/\D/g, ''))
  }, 0)
  
  const paidAmount = feeSummary
    .filter(record => record.status === "Paid")
    .reduce((sum, record) => sum + parseInt(record.amount.replace(/\D/g, '')), 0)
  
  const pendingAmount = totalAmount - paidAmount
  
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-9 w-36" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
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
      <Card className="shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl font-bold text-primary flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Recent Fee Transactions
            </CardTitle>
            <CardDescription>Latest fee payments and pending dues</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 text-sm">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 rounded-md">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Paid: PKR {paidAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 rounded-md">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <span>Pending: PKR {pendingAmount.toLocaleString()}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or ID..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 hidden sm:flex">
                    <Filter className="h-3.5 w-3.5" />
                    <span>{statusFilter === "all" ? "All Status" : statusFilter}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("paid")}>Paid Only</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending Only</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("overdue")}>Overdue Only</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" variant="outline" className="gap-1">
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
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
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((item, index) => (
                      <motion.tr 
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`group cursor-pointer hover:bg-muted/50 ${
                          item.status === "Overdue" 
                            ? "bg-red-50/40 dark:bg-red-900/10" 
                            : item.status === "Pending" 
                              ? "bg-yellow-50/40 dark:bg-yellow-900/10" 
                              : ""
                        }`}
                      >
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{item.name}</div>
                        </TableCell>
                        <TableCell>Class {item.class}</TableCell>
                        <TableCell>{item.feeType}</TableCell>
                        <TableCell className="font-medium">{item.amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              item.status === "Paid"
                                ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-200"
                                : item.status === "Pending"
                                  ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200"
                                  : "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300 border-red-200"
                            }
                          >
                            <span className="flex items-center">
                              <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                                item.status === "Paid" 
                                  ? "bg-green-500" 
                                  : item.status === "Pending" 
                                    ? "bg-yellow-500" 
                                    : "bg-red-500"
                              }`}></span>
                              {item.status}
                            </span>
                          </Badge>
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <Search className="h-8 w-8 text-muted-foreground opacity-40" />
                          <div className="text-muted-foreground">
                            No matching fee records found
                          </div>
                          {searchQuery || statusFilter !== "all" ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSearchQuery("")
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
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredRecords.length} of {feeSummary.length} transactions
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="default" 
                size="sm" 
                className="gap-1 bg-primary hover:bg-primary/90"
              >
                View All Transactions
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
