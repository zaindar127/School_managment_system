"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, FileImage, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Note {
  id: string
  class: string
  title: string
  content: string
  images: string[]
  createdAt: string
}

export default function TeacherNotesPage() {
  const router = useRouter()
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")

  // Demo data - In a real app, this would come from your database
  const [notes] = useState<Note[]>([
    {
      id: "1",
      class: "One",
      title: "Mathematics - Chapter 1",
      content: "Important points for addition and subtraction...",
      images: ["/math-diagram-1.jpg"],
      createdAt: "2024-03-15"
    },
    {
      id: "2",
      class: "Two",
      title: "English Grammar",
      content: "Notes on basic tenses and their usage...",
      images: ["/grammar-examples.jpg"],
      createdAt: "2024-03-14"
    }
  ])

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

  // Filter notes based on class and search query
  const filteredNotes = notes.filter(note => {
    const matchesClass = !selectedClass || selectedClass === "all" || note.class === selectedClass
    const matchesSearch = !searchQuery || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesClass && matchesSearch
  })

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
          <h1 className="text-3xl font-bold tracking-tight">Class Notes & Resources</h1>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            <SelectItem value="Nursery">Nursery</SelectItem>
            <SelectItem value="Prep">Prep</SelectItem>
            <SelectItem value="One">One</SelectItem>
            <SelectItem value="Two">Two</SelectItem>
            <SelectItem value="Three">Three</SelectItem>
            <SelectItem value="Four">Four</SelectItem>
            <SelectItem value="Five">Five</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredNotes.map((note) => (
          <motion.div key={note.id} variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle>{note.title}</CardTitle>
                <CardDescription>
                  Class: {note.class} | Added: {new Date(note.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{note.content}</p>
                {note.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {note.images.map((image, index) => (
                      <div key={index} className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                        <img 
                          src={image} 
                          alt={`Note image ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <FileImage className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No notes found</h3>
          <p className="text-sm text-muted-foreground">
            {selectedClass ? "Try selecting a different class or" : "Try"} adjusting your search.
          </p>
        </div>
      )}
    </motion.div>
  )
} 