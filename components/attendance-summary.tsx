"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Users, Calendar, Download, ArrowUpDown, ChevronDown } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function AttendanceSummary() {
  const [sortColumn, setSortColumn] = useState<string>("class")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [timeRange, setTimeRange] = useState<string>("today")
  
  // Extended attendance data with more details
  const attendanceData = {
    today: [
      { 
        class: "Nursery", 
        totalStudents: 25, 
        presentStudents: 22, 
        absentStudents: 3, 
        percentage: 88,
        date: "2023-10-30"
      },
      { 
        class: "Prep", 
        totalStudents: 30, 
        presentStudents: 27, 
        absentStudents: 3, 
        percentage: 90,
        date: "2023-10-30"
      },
      { 
        class: "One", 
        totalStudents: 28, 
        presentStudents: 22, 
        absentStudents: 6, 
        percentage: 79,
        date: "2023-10-30"
      },
      { 
        class: "Two", 
        totalStudents: 32, 
        presentStudents: 30, 
        absentStudents: 2, 
        percentage: 94,
        date: "2023-10-30"
      },
      { 
        class: "Three", 
        totalStudents: 35, 
        presentStudents: 31, 
        absentStudents: 4, 
        percentage: 89,
        date: "2023-10-30"
      }
    ],
    week: [
      { 
        class: "Nursery", 
        totalStudents: 25, 
        presentStudents: 23, 
        absentStudents: 2, 
        percentage: 92,
        date: "2023-10-24 to 2023-10-30"
      },
      { 
        class: "Prep", 
        totalStudents: 30, 
        presentStudents: 28, 
        absentStudents: 2, 
        percentage: 93,
        date: "2023-10-24 to 2023-10-30"
      },
      { 
        class: "One", 
        totalStudents: 28, 
        presentStudents: 25, 
        absentStudents: 3, 
        percentage: 89,
        date: "2023-10-24 to 2023-10-30"
      },
      { 
        class: "Two", 
        totalStudents: 32, 
        presentStudents: 29, 
        absentStudents: 3, 
        percentage: 91,
        date: "2023-10-24 to 2023-10-30"
      },
      { 
        class: "Three", 
        totalStudents: 35, 
        presentStudents: 32, 
        absentStudents: 3, 
        percentage: 91,
        date: "2023-10-24 to 2023-10-30"
      }
    ],
    month: [
      { 
        class: "Nursery", 
        totalStudents: 25, 
        presentStudents: 21, 
        absentStudents: 4, 
        percentage: 84,
        date: "October 2023"
      },
      { 
        class: "Prep", 
        totalStudents: 30, 
        presentStudents: 27, 
        absentStudents: 3, 
        percentage: 90,
        date: "October 2023"
      },
      { 
        class: "One", 
        totalStudents: 28, 
        presentStudents: 24, 
        absentStudents: 4, 
        percentage: 86,
        date: "October 2023"
      },
      { 
        class: "Two", 
        totalStudents: 32, 
        presentStudents: 28, 
        absentStudents: 4, 
        percentage: 88,
        date: "October 2023"
      },
      { 
        class: "Three", 
        totalStudents: 35, 
        presentStudents: 30, 
        absentStudents: 5, 
        percentage: 86,
        date: "October 2023"
      }
    ]
  }
  
  // Calculate overall attendance for the selected time range
  const calculateOverallAttendance = (timeRangeData: any[]) => {
    const totalStudents = timeRangeData.reduce((sum, item) => sum + item.totalStudents, 0)
    const presentStudents = timeRangeData.reduce((sum, item) => sum + item.presentStudents, 0)
    return {
      totalStudents,
      presentStudents,
      absentStudents: totalStudents - presentStudents,
      percentage: Math.round((presentStudents / totalStudents) * 100)
    }
  }
  
  const currentData = attendanceData[timeRange as keyof typeof attendanceData]
  const overallAttendance = calculateOverallAttendance(currentData)
  
  // Sorting function
  const sortData = (data: any[]) => {
    return [...data].sort((a, b) => {
      if (sortColumn === "percentage") {
        return sortDirection === "asc" ? a.percentage - b.percentage : b.percentage - a.percentage
      } else if (sortColumn === "present") {
        return sortDirection === "asc" ? a.presentStudents - b.presentStudents : b.presentStudents - a.presentStudents
      } else if (sortColumn === "absent") {
        return sortDirection === "asc" ? a.absentStudents - b.absentStudents : b.absentStudents - a.absentStudents
      } else {
        // Default sort by class
        return sortDirection === "asc" 
          ? a.class.localeCompare(b.class) 
          : b.class.localeCompare(a.class)
      }
    })
  }
  
  const sortedData = sortData(currentData)
  
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }
  
  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600 bg-green-50 dark:bg-green-900 dark:text-green-300"
    if (percentage >= 80) return "text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300"
    if (percentage >= 70) return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900 dark:text-yellow-300"
    return "text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-300"
  }
  
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-600"
    if (percentage >= 80) return "bg-blue-600"
    if (percentage >= 70) return "bg-yellow-600"
    return "bg-red-600"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-sm hover:shadow transition-all duration-200">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            <CardTitle className="text-xl font-medium">Attendance Summary</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Calendar className="mr-1 h-3.5 w-3.5" />
              {timeRange === "today" ? "Today's attendance" : 
               timeRange === "week" ? "This week's attendance" : "This month's attendance"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-primary/5 border-none">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{overallAttendance.totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-primary opacity-80" />
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 dark:bg-green-900/20 border-none">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Present</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {overallAttendance.presentStudents}
                    <span className="text-sm ml-1 font-normal">
                      ({overallAttendance.percentage}%)
                    </span>
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400 opacity-80" />
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 dark:bg-red-900/20 border-none">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Absent</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {overallAttendance.absentStudents}
                    <span className="text-sm ml-1 font-normal">
                      ({100 - overallAttendance.percentage}%)
                    </span>
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400 opacity-80" />
              </CardContent>
            </Card>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[100px] cursor-pointer" onClick={() => handleSort("class")}>
                    <div className="flex items-center">
                      Class
                      {sortColumn === "class" && (
                        <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "asc" ? "rotate-0" : "rotate-180"}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("present")}>
                    <div className="flex items-center">
                      Present
                      {sortColumn === "present" && (
                        <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "asc" ? "rotate-0" : "rotate-180"}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("absent")}>
                    <div className="flex items-center">
                      Absent
                      {sortColumn === "absent" && (
                        <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "asc" ? "rotate-0" : "rotate-180"}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("percentage")}>
                    <div className="flex items-center">
                      Percentage
                      {sortColumn === "percentage" && (
                        <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "asc" ? "rotate-0" : "rotate-180"}`} />
                      )}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((item, index) => (
                  <motion.tr 
                    key={item.class} 
                    className="group hover:bg-muted/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <TableCell className="font-medium">Class {item.class}</TableCell>
                    <TableCell>{item.totalStudents}</TableCell>
                    <TableCell className="text-green-600 dark:text-green-400">
                      {item.presentStudents}
                    </TableCell>
                    <TableCell className="text-red-600 dark:text-red-400">
                      {item.absentStudents}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={item.percentage} 
                          className="h-2 w-14"
                          indicatorClassName={getProgressColor(item.percentage)}
                        />
                        <Badge 
                          variant="outline"
                          className={`${getPercentageColor(item.percentage)} ml-1`}
                        >
                          {item.percentage}%
                        </Badge>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              {timeRange === "today" ? 
                "Data for " + sortedData[0]?.date : 
                "Data for period: " + sortedData[0]?.date}
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-3.5 w-3.5" />
                  <span>Export</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                <DropdownMenuItem>Export as Excel</DropdownMenuItem>
                <DropdownMenuItem>Print Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
