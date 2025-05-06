"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { UserCircle, BookOpen, GraduationCap, Medal, Award, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export default function TeacherProfilePage() {
  const router = useRouter()
  const [teacher, setTeacher] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    qualification: "",
    specialization: "",
    experience: "",
    joiningDate: "",
    emergencyContact: "",
  })

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const user = JSON.parse(userStr)
      setTeacher(user)
      
      // Populate form data with dummy values
      if (user.id === "teacher1") {
        setFormData({
          name: user.name,
          email: "ali.ahmed@example.com",
          phone: "0300-1234567",
          address: "123 Education Street, Islamabad",
          dateOfBirth: "1985-05-15",
          gender: "Male",
          qualification: "M.Ed",
          specialization: "Mathematics",
          experience: "8 years",
          joiningDate: "2016-08-10",
          emergencyContact: "0300-7654321",
        })
      } else {
        setFormData({
          name: user.name,
          email: "fatima.professor@example.com",
          phone: "0301-7654321",
          address: "456 Academic Avenue, Lahore",
          dateOfBirth: "1988-08-22",
          gender: "Female",
          qualification: "Ph.D",
          specialization: "Science",
          experience: "6 years",
          joiningDate: "2018-04-15",
          emergencyContact: "0301-1234567",
        })
      }
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

  if (!teacher) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-2xl font-bold">Session Expired</h1>
        <p className="text-muted-foreground">Please log in again to access your profile</p>
        <Button onClick={() => router.push("/login")}>Go to Login</Button>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would send this data to your API
    toast.success("Profile updated successfully")
  }

  const teacherData = {
    id: teacher.id === "teacher1" ? "T-1001" : "T-1002",
    employeeId: teacher.id === "teacher1" ? "EMP-0134" : "EMP-0156",
    department: teacher.id === "teacher1" ? "Mathematics" : "Science",
    assignedClass: teacher.class,
    profileImage: teacher.id === "teacher1" ? "/teacher1.jpg" : "/teacher2.jpg",
  }

  return (
    <motion.div 
      className="container mx-auto py-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Teacher Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="md:col-span-1 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 h-24"></div>
            <CardHeader className="text-center -mt-12 pb-4">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage src={teacherData.profileImage} alt={formData.name} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {formData.name.split(' ').map(word => word[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="mt-4 text-xl">{formData.name}</CardTitle>
              <div className="flex justify-center gap-2 mt-1">
                <Badge variant="outline" className="flex gap-1 items-center">
                  <GraduationCap className="h-3 w-3" />
                  {formData.qualification}
                </Badge>
                <Badge variant="secondary" className="flex gap-1 items-center">
                  <BookOpen className="h-3 w-3" />
                  Class {teacherData.assignedClass}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Employee ID</p>
                  <p className="font-medium">{teacherData.employeeId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Department</p>
                  <p className="font-medium">{teacherData.department}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Experience</p>
                  <p className="font-medium">{formData.experience}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Joining Date</p>
                  <p className="font-medium">{formData.joiningDate}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="font-medium">{formData.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="font-medium">{formData.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Specialization</p>
                <p className="font-medium">{formData.specialization}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Edit Form */}
        <motion.div
          className="md:col-span-2"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Update your personal and professional information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="professional">Professional</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal" className="space-y-4 mt-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input 
                          id="dateOfBirth" 
                          name="dateOfBirth" 
                          type="date" 
                          value={formData.dateOfBirth} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select 
                          value={formData.gender} 
                          onValueChange={(value) => handleSelectChange("gender", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input 
                          id="address" 
                          name="address" 
                          value={formData.address} 
                          onChange={handleInputChange} 
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="professional" className="space-y-4 mt-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="qualification">Qualification</Label>
                        <Input 
                          id="qualification" 
                          name="qualification" 
                          value={formData.qualification} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input 
                          id="specialization" 
                          name="specialization" 
                          value={formData.specialization} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Experience</Label>
                        <Input 
                          id="experience" 
                          name="experience" 
                          value={formData.experience} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="joiningDate">Joining Date</Label>
                        <Input 
                          id="joiningDate" 
                          name="joiningDate" 
                          type="date" 
                          value={formData.joiningDate} 
                          onChange={handleInputChange} 
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="contact" className="space-y-4 mt-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Emergency Contact</Label>
                        <Input 
                          id="emergencyContact" 
                          name="emergencyContact" 
                          value={formData.emergencyContact} 
                          onChange={handleInputChange} 
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Achievements Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6"
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-indigo-600" />
                    Professional Achievements
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    Add New
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Best Teacher Award</h3>
                        <p className="text-sm text-muted-foreground">Recognized for outstanding teaching methods and student results</p>
                      </div>
                      <Badge>2022</Badge>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Published Research Paper</h3>
                        <p className="text-sm text-muted-foreground">Modern teaching techniques in mathematics</p>
                      </div>
                      <Badge>2021</Badge>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Professional Development Workshop</h3>
                        <p className="text-sm text-muted-foreground">Conducted teacher training on digital learning tools</p>
                      </div>
                      <Badge>2020</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
} 