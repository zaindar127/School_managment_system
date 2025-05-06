"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

const DUMMY_HISTORY = [
  { id: "1035", name: "Muhammad Muheeb", date: new Date("2024-06-01"), status: "present" },
  { id: "1042", name: "Ahmed Hassan", date: new Date("2024-06-01"), status: "absent" },
  { id: "1056", name: "Ali Ahmed", date: new Date("2024-06-02"), status: "present" },
  { id: "1078", name: "Sara Khan", date: new Date("2024-06-02"), status: "present" },
  { id: "1089", name: "Hassan Ali", date: new Date("2024-06-03"), status: "present" },
  { id: "1092", name: "Fatima Zahra", date: new Date("2024-06-03"), status: "absent" },
  { id: "1095", name: "Zainab Ali", date: new Date("2024-06-03"), status: "present" },
]

const CLASSES = [
  { value: "all", label: "All Classes" },
  { value: "nursery", label: "Nursery" },
  { value: "prep", label: "Prep" },
  { value: "one", label: "One" },
  { value: "two", label: "Two" },
  { value: "three", label: "Three" },
  { value: "four", label: "Four" },
  { value: "five", label: "Five" },
]

export function StudentAttendanceHistory() {
  const [selectedClass, setSelectedClass] = useState("all")
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
  const [toDate, setToDate] = useState<Date | undefined>(undefined)

  // Filter logic (dummy, since DUMMY_HISTORY doesn't have class info)
  const filtered = DUMMY_HISTORY.filter((rec) => {
    let ok = true
    if (fromDate && rec.date < fromDate) ok = false
    if (toDate && rec.date > toDate) ok = false
    // If class info is added to DUMMY_HISTORY, filter by class here
    return ok
  })

  const statusBadge = (status: string) => {
    if (status === "present") return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">Present</span>
    if (status === "absent") return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">Absent</span>
    if (status === "leave") return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">Leave</span>
    return null
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">Student Attendance History</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {CLASSES.map((cls) => (
                <SelectItem key={cls.value} value={cls.value}>{cls.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-[180px] flex items-center justify-start border rounded-md px-3 py-2 bg-white text-sm">
                <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                {fromDate ? format(fromDate, "PPP") : "From date"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-[180px] flex items-center justify-start border rounded-md px-3 py-2 bg-white text-sm">
                <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                {toDate ? format(toDate, "PPP") : "To date"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        <div className="overflow-x-auto rounded-2xl shadow border border-blue-100 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-base text-gray-700 px-4 py-2">ID</TableHead>
                <TableHead className="text-base text-gray-700 px-4 py-2">Name</TableHead>
                <TableHead className="text-base text-gray-700 px-4 py-2">Date</TableHead>
                <TableHead className="text-base text-gray-700 px-4 py-2">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((rec) => (
                <TableRow key={rec.id + rec.date.toISOString()} className="hover:bg-blue-50/60 transition">
                  <TableCell className="px-4 py-2">{rec.id}</TableCell>
                  <TableCell className="px-4 py-2">{rec.name}</TableCell>
                  <TableCell className="px-4 py-2">{format(rec.date, "PPP")}</TableCell>
                  <TableCell className="px-4 py-2">{statusBadge(rec.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
} 