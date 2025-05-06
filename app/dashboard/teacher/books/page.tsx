"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BookOpen } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Book {
  id: string
  name: string
  class: string[]
}

export default function TeacherBooksPage() {
  const router = useRouter()
  const [teacher, setTeacher] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("all")
  
  // Demo books data - In a real app, this would come from your database
  const [books] = useState<Book[]>([
    { id: "eng", name: "English", class: ["Nursery", "Prep", "One", "Two", "Three", "Four", "Five"] },
    { id: "urdu", name: "Urdu", class: ["Nursery", "Prep", "One", "Two", "Three", "Four", "Five"] },
    { id: "physics", name: "Physics", class: ["Four", "Five"] },
    { id: "maths", name: "Mathematics", class: ["Nursery", "Prep", "One", "Two", "Three", "Four", "Five"] },
    { id: "chemistry", name: "Chemistry", class: ["Four", "Five"] },
    { id: "grammar", name: "Grammar", class: ["Nursery", "Prep", "One", "Two", "Three", "Four", "Five"] },
    { id: "islamiyat", name: "Islamiyat", class: ["Nursery", "Prep", "One", "Two", "Three", "Four", "Five"] }
  ])

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const user = JSON.parse(userStr)
      setTeacher(user)
    }
    setLoading(false)
  }, [])

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

  // Get books for teacher's class
  const getTeacherBooks = () => {
    if (!teacher) return []
    return books.filter(book => book.class.includes(teacher.class))
  }

  // Group books by subject type
  const groupedBooks = {
    languages: getTeacherBooks().filter(book => 
      ["English", "Urdu", "Grammar"].includes(book.name)
    ),
    sciences: getTeacherBooks().filter(book => 
      ["Physics", "Chemistry", "Mathematics"].includes(book.name)
    ),
    others: getTeacherBooks().filter(book => 
      !["English", "Urdu", "Grammar", "Physics", "Chemistry", "Mathematics"].includes(book.name)
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6" />
        <div className="space-y-4">
          <div className="h-12 bg-muted rounded animate-pulse" />
          <div className="h-12 bg-muted rounded animate-pulse" />
          <div className="h-12 bg-muted rounded animate-pulse" />
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-bold tracking-tight">Class Books</h1>
        </div>
      </div>

      <motion.div variants={itemVariants}>
        <Card className="border-border dark:bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Books for Class {teacher?.class}
            </CardTitle>
            <CardDescription className="dark:text-muted-foreground">
              View all books and subjects assigned to your class
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="all">All Books</TabsTrigger>
                <TabsTrigger value="languages">Languages</TabsTrigger>
                <TabsTrigger value="sciences">Sciences</TabsTrigger>
                <TabsTrigger value="others">Others</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getTeacherBooks().map((book) => (
                    <Card key={book.id} className="hover:shadow-md transition-shadow dark:bg-card/50 dark:hover:bg-card/80">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          {book.name}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="languages" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedBooks.languages.map((book) => (
                    <Card key={book.id} className="hover:shadow-md transition-shadow dark:bg-card/50 dark:hover:bg-card/80">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          {book.name}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="sciences" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedBooks.sciences.map((book) => (
                    <Card key={book.id} className="hover:shadow-md transition-shadow dark:bg-card/50 dark:hover:bg-card/80">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          {book.name}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="others" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedBooks.others.map((book) => (
                    <Card key={book.id} className="hover:shadow-md transition-shadow dark:bg-card/50 dark:hover:bg-card/80">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          {book.name}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
} 