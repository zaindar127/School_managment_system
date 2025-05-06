"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FileText, Printer } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { generatePDF } from "@/lib/pdf-generator"

export default function StaffDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [staff, setStaff] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching staff data
    const fetchData = () => {
      // This would be an API call in a real application
      const staffId = params.id as string

      // Dummy data
      const staffMembers = [
        {
          id: "31",
          name: "Abdul Sattar",
          fatherName: "Muhammad Akram",
          designation: "Staff",
          gender: "Male",
          phone: "03090909286",
          salary: "₹11,000",
          status: "Active",
          dateOfJoining: "2021-08-15",
          dateOfBirth: "1985-06-10",
          address: "789 Staff Quarters, City",
          educationQualification: "Bachelor's in Commerce",
          experience: "5 years",
        },
        {
          id: "32",
          name: "Fatima Zahra",
          fatherName: "Ali Hassan",
          designation: "Teacher",
          gender: "Female",
          phone: "03001234567",
          salary: "₹25,000",
          status: "Active",
          dateOfJoining: "2020-03-10",
          dateOfBirth: "1988-12-15",
          address: "456 Teacher Colony, City",
          educationQualification: "Master's in Education",
          experience: "7 years",
          classAssigned: "Two",
        },
      ]

      const foundStaff = staffMembers.find((s) => s.id === staffId)

      if (foundStaff) {
        setStaff(foundStaff)
      } else {
        toast({
          variant: "destructive",
          title: "Staff member not found",
          description: "The requested staff member could not be found.",
        })
        router.push("/staff")
      }

      setIsLoading(false)
    }

    fetchData()
  }, [params.id, router, toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading staff information...</p>
        </div>
      </div>
    )
  }

  if (!staff) {
    return null
  }

  const handleGenerateReport = () => {
    generatePDF({
      title: `Staff Report - ${staff.name}`,
      data: [
        { field: "Staff ID", value: staff.id },
        { field: "Name", value: staff.name },
        { field: "Father's Name", value: staff.fatherName },
        { field: "Designation", value: staff.designation },
        { field: "Gender", value: staff.gender },
        { field: "Phone", value: staff.phone },
        { field: "Salary", value: staff.salary },
        { field: "Status", value: staff.status },
        { field: "Date of Joining", value: staff.dateOfJoining },
        { field: "Date of Birth", value: staff.dateOfBirth },
        { field: "Address", value: staff.address },
        { field: "Education", value: staff.educationQualification },
        { field: "Experience", value: staff.experience },
      ],
      columns: [
        { header: "Field", key: "field" },
        { header: "Value", key: "value" },
      ],
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Staff Profile</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <Button onClick={handleGenerateReport}>
            <Printer className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Staff Information</CardTitle>
            <CardDescription>Basic details about the staff member</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-4">
              {/* Staff Image Placeholder */}
              <div className="bg-muted h-32 w-32 rounded-full flex items-center justify-center text-4xl font-bold text-muted-foreground">
                {staff.name.charAt(0)}
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Staff ID</span>
                <p className="font-medium">{staff.id}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Name</span>
                <p className="font-medium">{staff.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Father's Name</span>
                <p className="font-medium">{staff.fatherName}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Designation</span>
                <p className="font-medium">{staff.designation}</p>
              </div>
              {staff.classAssigned && (
                <div>
                  <span className="text-sm text-muted-foreground">Class Assigned</span>
                  <p className="font-medium">{staff.classAssigned}</p>
                </div>
              )}
              <div>
                <span className="text-sm text-muted-foreground">Status</span>
                <p
                  className={`font-medium ${staff.status === "Active" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {staff.status}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader className="p-4">
            <Tabs defaultValue="personal">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal Details</TabsTrigger>
                <TabsTrigger value="professional">Professional Info</TabsTrigger>
                <TabsTrigger value="salary">Salary Information</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="personal" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Gender</span>
                  <p className="font-medium">{staff.gender}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Date of Birth</span>
                  <p className="font-medium">{staff.dateOfBirth}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Phone Number</span>
                  <p className="font-medium">{staff.phone}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Date of Joining</span>
                  <p className="font-medium">{staff.dateOfJoining}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-sm text-muted-foreground">Address</span>
                  <p className="font-medium">{staff.address}</p>
                </div>
              </div>

              <Button className="mt-4">
                <FileText className="mr-2 h-4 w-4" />
                Edit Personal Information
              </Button>
            </TabsContent>
            <TabsContent value="professional" className="space-y-6">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Educational Qualifications</h3>
                <p>{staff.educationQualification}</p>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Experience</h3>
                <p>{staff.experience}</p>
              </div>

              {staff.designation === "Teacher" && (
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Teaching Schedule</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-2 font-medium">Day</th>
                        <th className="pb-2 font-medium">Time</th>
                        <th className="pb-2 font-medium">Subject</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Monday</td>
                        <td className="py-2">08:00 - 10:00</td>
                        <td className="py-2">Mathematics</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Tuesday</td>
                        <td className="py-2">09:00 - 11:00</td>
                        <td className="py-2">Science</td>
                      </tr>
                      <tr>
                        <td className="py-2">Wednesday</td>
                        <td className="py-2">10:00 - 12:00</td>
                        <td className="py-2">Mathematics</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              <Button className="mt-4">
                <FileText className="mr-2 h-4 w-4" />
                Edit Professional Information
              </Button>
            </TabsContent>
            <TabsContent value="salary" className="space-y-6">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Salary Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Basic Salary</span>
                    <p className="font-medium">{staff.salary}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Payment Method</span>
                    <p className="font-medium">Bank Transfer</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Account Number</span>
                    <p className="font-medium">XXXX-XXXX-XXXX-1234</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Last Payment Date</span>
                    <p className="font-medium">2023-04-01</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Recent Salary Transactions</h3>
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-2 font-medium">Month</th>
                      <th className="pb-2 font-medium">Date</th>
                      <th className="pb-2 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">April 2023</td>
                      <td className="py-2">2023-04-01</td>
                      <td className="py-2 text-right">{staff.salary}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">March 2023</td>
                      <td className="py-2">2023-03-01</td>
                      <td className="py-2 text-right">{staff.salary}</td>
                    </tr>
                    <tr>
                      <td className="py-2">February 2023</td>
                      <td className="py-2">2023-02-01</td>
                      <td className="py-2 text-right">{staff.salary}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <Button className="mt-4">
                <Printer className="mr-2 h-4 w-4" />
                Print Salary Statement
              </Button>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
