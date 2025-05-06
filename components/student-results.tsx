"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Star, BarChart3, Trophy, Award } from "lucide-react"
import { generatePDF } from "@/lib/pdf-generator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function StudentResults({ studentId }: { studentId: string }) {
  const [selectedTerm, setSelectedTerm] = useState("current")

  // Dummy results data for current term
  const currentTermResults = [
    { subject: "English Reading", totalMarks: 100, obtainedMarks: 90, grade: "A+", status: "Pass" },
    { subject: "English Written", totalMarks: 100, obtainedMarks: 85, grade: "A", status: "Pass" },
    { subject: "Urdu Reading", totalMarks: 100, obtainedMarks: 95, grade: "A+", status: "Pass" },
    { subject: "Urdu Written", totalMarks: 100, obtainedMarks: 88, grade: "A", status: "Pass" },
    { subject: "Mathematics", totalMarks: 100, obtainedMarks: 92, grade: "A+", status: "Pass" },
  ]

  // Dummy results data for previous term
  const previousTermResults = [
    { subject: "English Reading", totalMarks: 100, obtainedMarks: 88, grade: "A", status: "Pass" },
    { subject: "English Written", totalMarks: 100, obtainedMarks: 80, grade: "A", status: "Pass" },
    { subject: "Urdu Reading", totalMarks: 100, obtainedMarks: 92, grade: "A+", status: "Pass" },
    { subject: "Urdu Written", totalMarks: 100, obtainedMarks: 85, grade: "A", status: "Pass" },
    { subject: "Mathematics", totalMarks: 100, obtainedMarks: 89, grade: "A", status: "Pass" },
  ]

  // Get results based on selected term
  const resultsData = selectedTerm === "current" ? currentTermResults : previousTermResults

  const totalMarks = resultsData.reduce((sum, subject) => sum + subject.totalMarks, 0)
  const obtainedMarks = resultsData.reduce((sum, subject) => sum + subject.obtainedMarks, 0)
  const percentageValue = (obtainedMarks / totalMarks) * 100
  const percentage = percentageValue.toFixed(2)

  // Calculate performance improvement
  const previousPercentage = previousTermResults.reduce((sum, subject) => sum + subject.obtainedMarks, 0) / 
    previousTermResults.reduce((sum, subject) => sum + subject.totalMarks, 0) * 100
  
  const percentageImprovement = (
    selectedTerm === "current" ? 
    (percentageValue - previousPercentage).toFixed(2) : 
    "0.00"
  )

  // Helper function to get grade based on percentage
  const getGrade = (percent: number) => {
    if (percent >= 90) return "A+"
    if (percent >= 80) return "A"
    if (percent >= 70) return "B+"
    if (percent >= 60) return "B"
    if (percent >= 50) return "C"
    return "F"
  }

  const overallGrade = getGrade(percentageValue)

  const handleGenerateResultCard = () => {
    const dataToExport = resultsData.map((result) => ({
      subject: result.subject,
      totalMarks: result.totalMarks,
      obtainedMarks: result.obtainedMarks,
      grade: result.grade,
      status: result.status,
    }))

    generatePDF({
      title: `Result Card - Student ID: ${studentId} - ${selectedTerm === "current" ? "Current Term" : "Previous Term"}`,
      data: dataToExport,
      columns: [
        { header: "Subject", key: "subject" },
        { header: "Total Marks", key: "totalMarks" },
        { header: "Obtained Marks", key: "obtainedMarks" },
        { header: "Grade", key: "grade" },
        { header: "Status", key: "status" },
      ],
      summary: [
        { label: "Total Marks", value: totalMarks },
        { label: "Obtained Marks", value: obtainedMarks },
        { label: "Percentage", value: `${percentage}%` },
        {
          label: "Overall Grade",
          value: overallGrade,
        },
      ],
    })
  }

  return (
    <Card className="shadow-sm hover:shadow-md transition-all">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold text-indigo-800">Academic Results</CardTitle>
          <CardDescription>Your academic performance records</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleGenerateResultCard}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <Card className="flex-1 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100 dark:from-indigo-950/20 dark:to-purple-950/20 dark:border-indigo-900/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-indigo-700 text-lg font-medium dark:text-indigo-400">Overall Performance</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-3xl font-bold text-indigo-900 dark:text-indigo-300">{percentage}%</p>
                    {percentageImprovement !== "0.00" && (
                      <Badge className={parseFloat(percentageImprovement) > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {parseFloat(percentageImprovement) > 0 ? "+" : ""}{percentageImprovement}%
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-full shadow-sm dark:bg-gray-800">
                  <Trophy className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <Progress value={percentageValue} className="h-2 mt-4 bg-indigo-200 dark:bg-indigo-900/30 [&>div]:bg-indigo-600 dark:[&>div]:bg-indigo-500" />
              <div className="flex justify-between text-xs mt-1 text-indigo-600 dark:text-indigo-400">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100 dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-900/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-amber-700 text-lg font-medium dark:text-amber-400">Grade Achieved</p>
                  <p className="text-3xl font-bold text-amber-900 dark:text-amber-300 mt-1">
                    {overallGrade}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-full shadow-sm dark:bg-gray-800">
                  <Award className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="grid grid-cols-5 gap-1 mt-4">
                {['F', 'D', 'C', 'B', 'A'].map((grade, i) => (
                  <div key={i} 
                    className={`h-8 flex items-center justify-center rounded ${
                      (percentageValue >= 90 && grade === 'A') ||
                      (percentageValue >= 80 && percentageValue < 90 && grade === 'A') ||
                      (percentageValue >= 70 && percentageValue < 80 && grade === 'B') ||
                      (percentageValue >= 60 && percentageValue < 70 && grade === 'C') ||
                      (percentageValue >= 50 && percentageValue < 60 && grade === 'D') ||
                      (percentageValue < 50 && grade === 'F')
                        ? 'bg-amber-600 text-white font-bold'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {grade}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100 dark:from-blue-950/20 dark:to-cyan-950/20 dark:border-blue-900/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-700 text-lg font-medium dark:text-blue-400">Top Subject</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-300 mt-1">
                    {resultsData.reduce((prev, current) => (prev.obtainedMarks > current.obtainedMarks) ? prev : current).subject}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-full shadow-sm dark:bg-gray-800">
                  <Star className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex items-end mt-4 gap-1">
                {resultsData.map((result, i) => (
                  <div key={i} 
                    className="flex-1"
                    title={result.subject}
                  >
                    <div className="h-24 flex flex-col justify-end">
                      <div 
                        className="bg-blue-600 rounded-t"
                        style={{ height: `${(result.obtainedMarks / result.totalMarks) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-center mt-1 text-blue-700 truncate">{result.subject.split(' ')[0]}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="current" className="w-full" onValueChange={setSelectedTerm}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="current">Current Term</TabsTrigger>
              <TabsTrigger value="previous">Previous Term</TabsTrigger>
            </TabsList>
            <p className="text-sm text-muted-foreground">
              {selectedTerm === "current" ? "Mid-Term Examination Results" : "First-Term Examination Results"}
            </p>
          </div>

          <TabsContent value="current">
            <div className="rounded-md border overflow-hidden mt-4">
              <Table>
                <TableHeader className="bg-indigo-50 dark:bg-indigo-950/30">
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center">Total Marks</TableHead>
                    <TableHead className="text-center">Obtained Marks</TableHead>
                    <TableHead className="text-center">Percentage</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentTermResults.map((result, index) => (
                    <TableRow key={result.subject} className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800/50" : ""}>
                      <TableCell className="font-medium">{result.subject}</TableCell>
                      <TableCell className="text-center">{result.totalMarks}</TableCell>
                      <TableCell className="text-center">{result.obtainedMarks}</TableCell>
                      <TableCell className="text-center">
                        {((result.obtainedMarks / result.totalMarks) * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={
                          result.grade === "A+" ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300" :
                          result.grade === "A" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300" :
                          result.grade === "B+" ? "bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300" :
                          "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                        }>
                          {result.grade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                          {result.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="previous">
            <div className="rounded-md border overflow-hidden mt-4">
              <Table>
                <TableHeader className="bg-indigo-50 dark:bg-indigo-950/30">
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center">Total Marks</TableHead>
                    <TableHead className="text-center">Obtained Marks</TableHead>
                    <TableHead className="text-center">Percentage</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previousTermResults.map((result, index) => (
                    <TableRow key={result.subject} className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800/50" : ""}>
                      <TableCell className="font-medium">{result.subject}</TableCell>
                      <TableCell className="text-center">{result.totalMarks}</TableCell>
                      <TableCell className="text-center">{result.obtainedMarks}</TableCell>
                      <TableCell className="text-center">
                        {((result.obtainedMarks / result.totalMarks) * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={
                          result.grade === "A+" ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300" :
                          result.grade === "A" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300" :
                          result.grade === "B+" ? "bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300" :
                          "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                        }>
                          {result.grade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                          {result.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Class Average: {selectedTerm === "current" ? "82.5%" : "80.2%"}
            </span>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span className="text-xs text-muted-foreground">Your Score</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <span className="text-xs text-muted-foreground">Class Average</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
