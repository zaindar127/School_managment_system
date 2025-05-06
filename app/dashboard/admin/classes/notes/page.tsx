"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, FileImage, Upload, X, Plus, Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"

interface Note {
  id: string
  class: string
  title: string
  content: string
  images: string[]
  createdAt: string
}

export default function ClassNotesPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [newNote, setNewNote] = useState({
    class: "",
    title: "",
    content: ""
  })

  // Demo data
  const [notes, setNotes] = useState<Note[]>([
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

  const handleAddNote = () => {
    setEditingNote(null)
    setNewNote({ class: "", title: "", content: "" })
    setUploadedImages([])
    setShowAddDialog(true)
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setNewNote({
      class: note.class,
      title: note.title,
      content: note.content
    })
    setUploadedImages(note.images)
    setShowAddDialog(true)
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId))
    toast.success("Note deleted successfully")
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newImages: string[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push(e.target.result as string)
          if (newImages.length === files.length) {
            setUploadedImages([...uploadedImages, ...newImages])
            toast.success("Images uploaded successfully")
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (!newNote.class || !newNote.title || !newNote.content) {
      toast.error("Please fill in all required fields")
      return
    }

    if (editingNote) {
      setNotes(notes.map(note => 
        note.id === editingNote.id 
          ? {
              ...note,
              class: newNote.class,
              title: newNote.title,
              content: newNote.content,
              images: uploadedImages
            }
          : note
      ))
      toast.success("Note updated successfully")
    } else {
      const newNoteData: Note = {
        id: Date.now().toString(),
        class: newNote.class,
        title: newNote.title,
        content: newNote.content,
        images: uploadedImages,
        createdAt: new Date().toISOString()
      }
      setNotes([...notes, newNoteData])
      toast.success("Note added successfully")
    }
    setShowAddDialog(false)
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
          <h1 className="text-3xl font-bold tracking-tight">Class Notes & Resources</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
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

        <Button
          onClick={handleAddNote}
          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Note
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notes
          .filter(note => !selectedClass || selectedClass === "all" || note.class === selectedClass)
          .map((note) => (
            <motion.div key={note.id} variants={itemVariants}>
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{note.title}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditNote(note)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
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

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingNote ? "Edit Note" : "Add New Note"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Class</Label>
              <Select 
                value={newNote.class} 
                onValueChange={(value) => setNewNote({ ...newNote, class: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nursery">Nursery</SelectItem>
                  <SelectItem value="Prep">Prep</SelectItem>
                  <SelectItem value="One">One</SelectItem>
                  <SelectItem value="Two">Two</SelectItem>
                  <SelectItem value="Three">Three</SelectItem>
                  <SelectItem value="Four">Four</SelectItem>
                  <SelectItem value="Five">Five</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                placeholder="Enter note title" 
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea 
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                placeholder="Enter note content" 
              />
            </div>
            <div className="space-y-2">
              <Label>Images</Label>
              <div 
                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drag & drop images here or click to upload
                </p>
              </div>
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                      <img 
                        src={image} 
                        alt={`Uploaded image ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
            >
              {editingNote ? "Save Changes" : "Add Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
} 