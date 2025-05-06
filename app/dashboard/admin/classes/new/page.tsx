"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, School } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function NewClassPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    section: "A",
    capacity: "",
    teacher: "",
    subjects: [] as string[],
  })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  }

  // Available teachers list (dummy data)
  const teachers = [
    { id: "1", name: "Sarah Ahmed" },
    { id: "2", name: "Muhammad Ali" },
    { id: "3", name: "Fatima Zahra" },
    { id: "4", name: "Ahmed Khan" },
    { id: "5", name: "Aisha Malik" },
  ]

  // Available subjects list (dummy data)
  const availableSubjects = [
    "English",
    "Urdu",
    "Mathematics",
    "Science",
    "Islamiyat",
    "Computer Science",
    "Physics",
    "Chemistry",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Here you would typically make an API call to save the class
    // For now, we'll simulate a delay and show a success message
    setTimeout(() => {
      setLoading(false)
      toast.success("Class created successfully")
      router.push("/dashboard/admin/classes")
    }, 1000)
  }

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Back Button */}
      <motion.div variants={itemVariants}>
        <Button
          onClick={() => router.push("/dashboard/admin/classes")}
          variant="ghost"
          className="mb-4 flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Classes</span>
        </Button>
      </motion.div>

      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Add New Class</h2>
        <p className="text-muted-foreground">
          Create a new class and assign a teacher and subjects
        </p>
      </motion.div>

      {/* Form */}
      <motion.div variants={itemVariants}>
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Class Details</CardTitle>
              <CardDescription>Enter the details for the new class</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Class Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Class Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., One, Two, Three"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* Section */}
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Select
                  value={formData.section}
                  onValueChange={(value) => setFormData({ ...formData, section: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Section A</SelectItem>
                    <SelectItem value="B">Section B</SelectItem>
                    <SelectItem value="C">Section C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Capacity */}
              <div className="space-y-2">
                <Label htmlFor="capacity">Class Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="Maximum number of students"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  required
                />
              </div>

              {/* Class Teacher */}
              <div className="space-y-2">
                <Label htmlFor="teacher">Class Teacher</Label>
                <Select
                  value={formData.teacher}
                  onValueChange={(value) => setFormData({ ...formData, teacher: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subjects */}
              <div className="space-y-2">
                <Label>Subjects</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {availableSubjects.map((subject) => (
                    <Button
                      key={subject}
                      type="button"
                      variant={formData.subjects.includes(subject) ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          subjects: formData.subjects.includes(subject)
                            ? formData.subjects.filter((s) => s !== subject)
                            : [...formData.subjects, subject],
                        })
                      }}
                    >
                      <School className="mr-2 h-4 w-4" />
                      {subject}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
                >
                  {loading ? "Creating..." : "Create Class"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </motion.div>
    </motion.div>
  )
} 