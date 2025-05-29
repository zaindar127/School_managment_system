"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BookOpen, FileImage, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BookManagement } from "@/components/book-management"
import { TimetableManagement } from "@/components/timetable-management"
import { useState } from "react"

export default function ClassesPage() {
  const router = useRouter()
  const [showBookDialog, setShowBookDialog] = useState(false)

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

  return (
    <motion.div
      className="space-y-6 p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Class Management</h1>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div variants={itemVariants}>
          <Card 
            className="h-full flex flex-col justify-between hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => setShowBookDialog(true)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                Manage Books
              </CardTitle>
              <CardDescription>
                Add, edit, or remove books and subjects for each class
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card 
            className="h-full flex flex-col justify-between hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => router.push("/dashboard/admin/classes/notes")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-6 w-6 text-green-600" />
                Class Notes & Resources
              </CardTitle>
              <CardDescription>
                Add notes, images, and resources for teachers
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card
            className="h-full flex flex-col justify-between hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => router.push("/dashboard/admin/classes/timetable")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-purple-600" />
                Timetable
              </CardTitle>
              <CardDescription>
                Create and manage class schedules, assign teachers to subjects, and organize the academic timetable across all departments.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      </div>

      <Dialog open={showBookDialog} onOpenChange={setShowBookDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          <DialogHeader className="sticky top-0 z-10 bg-background px-6 py-4 border-b">
            <DialogTitle>Manage Books</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4">
            <BookManagement />
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}