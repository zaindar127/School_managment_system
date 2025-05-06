"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, TrendingUp, Award, BookOpen } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function StudentResultPage() {
  const router = useRouter()
  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedExamType, setSelectedExamType] = useState("final")
  
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
        <p className="text-muted-foreground">Please log in again to view your results</p>
        <Button onClick={() => router.push("/login")}>Go to Login</Button>
      </div>
    )
  }

  // Generate dummy result data based on student ID
  const generateResultData = () => {
    // Use different performance for different student IDs
    const isHighPerformer = student.id === "student1"
    
    // Academic Year
    const academicYear = "2023-2024"
    
    // Subjects list
    const subjects = [
      "Mathematics", 
      "English", 
      "Urdu", 
      "Physics", 
      "Chemistry", 
      "Biology", 
      "Computer Science", 
      "Islamiyat"
    ]
    
    // Exam types
    const examTypes = [
      { value: "weekly", label: "Weekly Tests" },
      { value: "monthly", label: "Monthly Tests" },
      { value: "mid", label: "Mid-Term Exams" },
      { value: "final", label: "Final Exams" }
    ]
    
    // Generate exam results
    const generateExamResults = (examType: string) => {
      const results: any = {}
      
      // Performance modifier based on student and exam type
      const performanceModifier = isHighPerformer ? 0.9 : 0.75
      const examModifier = examType === "final" ? 1 : 
                          examType === "mid" ? 0.95 :
                          examType === "monthly" ? 0.9 : 0.85
      
      subjects.forEach(subject => {
        const basePerformance = performanceModifier * examModifier
        
        // Random but consistent marks for each subject
        const hash = (subject.length + examType.length + (isHighPerformer ? 10 : 5)) % 20
        const totalMarks = 100
        const obtainedMarks = Math.round((basePerformance * totalMarks) + hash - 10)
        const percentage = (obtainedMarks / totalMarks) * 100
        
        // Calculate grade based on percentage
        let grade
        if (percentage >= 90) grade = "A+"
        else if (percentage >= 80) grade = "A"
        else if (percentage >= 70) grade = "B"
        else if (percentage >= 60) grade = "C"
        else if (percentage >= 50) grade = "D"
        else grade = "F"
        
        // Set pass/fail status
        const status = percentage >= 50 ? "Pass" : "Fail"
        
        results[subject] = {
          subject,
          totalMarks,
          obtainedMarks,
          percentage: percentage.toFixed(1),
          grade,
          status
        }
      })
      
      return results
    }
    
    // Generate all exam results
    const allResults = {
      weekly: generateExamResults("weekly"),
      monthly: generateExamResults("monthly"),
      mid: generateExamResults("mid"),
      final: generateExamResults("final")
    }
    
    // Calculate overall stats for each exam type
    const calculateStats = (examResults: any) => {
      const subjectResults = Object.values(examResults)
      const totalSubjects = subjectResults.length
      const totalObtainedMarks = subjectResults.reduce((sum: number, result: any) => sum + result.obtainedMarks, 0)
      const totalPossibleMarks = totalSubjects * 100
      const overallPercentage = (totalObtainedMarks / totalPossibleMarks) * 100
      
      // Calculate grade distribution
      const grades: any = {
        "A+": 0, "A": 0, "B": 0, "C": 0, "D": 0, "F": 0
      }
      
      subjectResults.forEach((result: any) => {
        grades[result.grade]++
      })
      
      // Overall grade
      let overallGrade
      if (overallPercentage >= 90) overallGrade = "A+"
      else if (overallPercentage >= 80) overallGrade = "A"
      else if (overallPercentage >= 70) overallGrade = "B"
      else if (overallPercentage >= 60) overallGrade = "C"
      else if (overallPercentage >= 50) overallGrade = "D"
      else overallGrade = "F"
      
      return {
        totalSubjects,
        totalObtainedMarks,
        totalPossibleMarks,
        overallPercentage: overallPercentage.toFixed(1),
        overallGrade,
        grades
      }
    }
    
    const stats = {
      weekly: calculateStats(allResults.weekly),
      monthly: calculateStats(allResults.monthly),
      mid: calculateStats(allResults.mid),
      final: calculateStats(allResults.final)
    }
    
    // Past years data summary (for comparison)
    const pastYears = [
      {
        year: "2022-2023",
        percentage: isHighPerformer ? "87.5%" : "76.3%",
        grade: isHighPerformer ? "A" : "B"
      },
      {
        year: "2021-2022",
        percentage: isHighPerformer ? "86.2%" : "72.8%",
        grade: isHighPerformer ? "A" : "B"
      }
    ]
    
    return {
      student: {
        name: student.name,
        id: student.id === "student1" ? "1035" : "1036",
        class: student.class,
        rollNo: student.id === "student1" ? "05" : "12",
      },
      academicYear,
      examTypes,
      results: allResults,
      stats,
      pastYears
    }
  }
  
  const resultData = generateResultData()
  
  const currentResults = resultData.results[selectedExamType as keyof typeof resultData.results]
  const currentStats = resultData.stats[selectedExamType as keyof typeof resultData.stats]
  
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+": return "bg-purple-100 text-purple-700 border-purple-200"
      case "A": return "bg-indigo-100 text-indigo-700 border-indigo-200"
      case "B": return "bg-blue-100 text-blue-700 border-blue-200"
      case "C": return "bg-green-100 text-green-700 border-green-200"
      case "D": return "bg-amber-100 text-amber-700 border-amber-200"
      case "F": return "bg-red-100 text-red-700 border-red-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }
  
  const getStatusColor = (status: string) => {
    return status === "Pass" 
      ? "bg-green-100 text-green-700 border-green-200" 
      : "bg-red-100 text-red-700 border-red-200"
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Academic Results</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back to Dashboard
        </Button>
      </div>
      
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <h2 className="text-lg font-semibold text-blue-900">Academic Year: {resultData.academicYear}</h2>
              <p className="text-blue-700 mt-1">
                Class: {resultData.student.class} | Roll No: {resultData.student.rollNo}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white">
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  {resultData.examTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="bg-blue-600 hover:bg-blue-700 flex gap-2">
                <Download className="h-4 w-4" />
                Download Results
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Result Summary Card */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Results Summary</CardTitle>
            <CardDescription>
              {resultData.examTypes.find(t => t.value === selectedExamType)?.label} - {resultData.academicYear}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-8 border-indigo-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-700">
                    {currentStats.overallPercentage}%
                  </div>
                  <div className={`text-sm font-medium rounded-full px-2 mt-1 ${getGradeColor(currentStats.overallGrade)}`}>
                    Grade {currentStats.overallGrade}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subjects</span>
                <span className="font-medium">{currentStats.totalSubjects}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Marks</span>
                <span className="font-medium">{currentStats.totalObtainedMarks}/{currentStats.totalPossibleMarks}</span>
              </div>
              
              <div className="pt-2">
                <div className="text-sm font-medium mb-2">Grade Distribution</div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(currentStats.grades).map(([grade, count]) => (
                    (count as number) > 0 ? (
                      <div key={grade} className={`text-center py-1 rounded-md text-xs font-medium ${getGradeColor(grade)}`}>
                        {grade}: {count as number}
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <div className="text-sm font-medium">Previous Years Performance</div>
              {resultData.pastYears.map((year, index) => (
                <div key={index} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-md">
                  <span>{year.year}</span>
                  <div className="flex items-center gap-2">
                    <span>{year.percentage}</span>
                    <Badge variant="outline" className={getGradeColor(year.grade)}>
                      {year.grade}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Subject-wise Results Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Subject-wise Results</CardTitle>
            <CardDescription>
              Detailed performance in each subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left">Subject</th>
                    <th className="px-4 py-3 text-left">Marks</th>
                    <th className="px-4 py-3 text-left">Percentage</th>
                    <th className="px-4 py-3 text-left">Grade</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(currentResults).map((result: any, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-4 font-medium">{result.subject}</td>
                      <td className="px-4 py-4">{result.obtainedMarks}/{result.totalMarks}</td>
                      <td className="px-4 py-4">{result.percentage}%</td>
                      <td className="px-4 py-4">
                        <Badge variant="outline" className={getGradeColor(result.grade)}>
                          {result.grade}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="outline" className={getStatusColor(result.status)}>
                          {result.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="performance">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Exams Comparison</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
              <CardDescription>
                Subject-wise performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.values(currentResults).map((result: any, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{result.subject}</span>
                      </div>
                      <Badge variant="outline" className={getGradeColor(result.grade)}>
                        {result.grade}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={Number(result.percentage)} className="h-2" />
                      <span className="text-sm font-medium w-12">{result.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Exams Comparison</CardTitle>
              <CardDescription>
                Your performance across different exams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left">Exam Type</th>
                        <th className="px-4 py-3 text-left">Average</th>
                        <th className="px-4 py-3 text-left">Grade</th>
                        <th className="px-4 py-3 text-left">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(resultData.results).map((examType) => {
                        const stats = resultData.stats[examType as keyof typeof resultData.stats]
                        const isSelected = examType === selectedExamType
                        
                        return (
                          <tr key={examType} className={`border-b ${isSelected ? 'bg-blue-50' : ''}`}>
                            <td className="px-4 py-4 font-medium">
                              {resultData.examTypes.find(t => t.value === examType)?.label}
                              {isSelected && <span className="ml-2 text-blue-600">(Current)</span>}
                            </td>
                            <td className="px-4 py-4">{stats.overallPercentage}%</td>
                            <td className="px-4 py-4">
                              <Badge variant="outline" className={getGradeColor(stats.overallGrade)}>
                                {stats.overallGrade}
                              </Badge>
                            </td>
                            <td className="px-4 py-4">
                              <div className="w-48">
                                <Progress value={Number(stats.overallPercentage)} className="h-2" />
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-blue-900">Performance Trend</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        {Number(resultData.stats.final.overallPercentage) > Number(resultData.stats.mid.overallPercentage)
                          ? "Your performance has improved in the final exams compared to mid-terms. Keep up the good work!"
                          : "Your performance in mid-terms was stronger than finals. Focus on maintaining consistency throughout the year."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Academic Insights</CardTitle>
          <CardDescription>
            Key observations and improvement areas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Dynamically generate insights based on results */}
            {(() => {
              // Find best and worst subjects
              const subjects = Object.values(currentResults)
              subjects.sort((a: any, b: any) => b.obtainedMarks - a.obtainedMarks)
              
              const bestSubject = subjects[0] as any
              const worstSubject = subjects[subjects.length - 1] as any
              
              // Calculate if improving or declining
              const finalPercentage = Number(resultData.stats.final.overallPercentage)
              const midPercentage = Number(resultData.stats.mid.overallPercentage)
              const trend = finalPercentage >= midPercentage ? "improving" : "declining"
              
              return (
                <>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      Strongest Subject
                    </h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{bestSubject?.subject}</span> is your highest scoring subject with {bestSubject?.percentage}% marks (Grade {bestSubject?.grade}).
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-amber-600 transform rotate-180" />
                      Needs Improvement
                    </h3>
                    <p className="text-sm text-gray-600">
                      Focus more on <span className="font-medium">{worstSubject?.subject}</span> where you scored {worstSubject?.percentage}% marks (Grade {worstSubject?.grade}).
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <TrendingUp className={`h-4 w-4 ${trend === "improving" ? "text-green-600" : "text-amber-600"}`} />
                      Overall Trend
                    </h3>
                    <p className="text-sm text-gray-600">
                      Your overall performance is {trend} with an average of {currentStats.overallPercentage}% across all subjects.
                    </p>
                  </div>
                </>
              )
            })()}
          </div>
          
          <div className="pt-2 flex justify-end">
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              View Detailed Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
