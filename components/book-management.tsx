import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"

interface Book {
  id: string
  name: string
  totalMarks: number
  class: string[]
}

export function BookManagement() {
  const [books, setBooks] = useState<Book[]>([
    { id: "eng", name: "English", totalMarks: 100, class: ["Nursery", "Prep", "One", "Two", "Three", "Four", "Five"] },
    { id: "urdu", name: "Urdu", totalMarks: 100, class: ["Nursery", "Prep", "One", "Two", "Three", "Four", "Five"] },
    { id: "physics", name: "Physics", totalMarks: 100, class: ["Four", "Five"] },
    { id: "maths", name: "Mathematics", totalMarks: 100, class: ["Nursery", "Prep", "One", "Two", "Three", "Four", "Five"] },
    { id: "chemistry", name: "Chemistry", totalMarks: 100, class: ["Four", "Five"] },
    { id: "grammar", name: "Grammar", totalMarks: 100, class: ["Nursery", "Prep", "One", "Two", "Three", "Four", "Five"] },
    { id: "islamiyat", name: "Islamiyat", totalMarks: 100, class: ["Nursery", "Prep", "One", "Two", "Three", "Four", "Five"] }
  ])
  const [showBookDialog, setShowBookDialog] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)

  // Handle adding/editing book
  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBook) return

    if (editingBook.id) {
      // Editing existing book
      setBooks(books.map(b => b.id === editingBook.id ? editingBook : b))
    } else {
      // Adding new book
      const newBook: Book = {
        id: Math.random().toString(36).substr(2, 9),
        name: editingBook.name,
        totalMarks: editingBook.totalMarks,
        class: editingBook.class
      }
      setBooks(prevBooks => [...prevBooks, newBook])
    }
    setShowBookDialog(false)
    setEditingBook(null)
  }

  // Handle book deletion
  const handleDeleteBook = (bookId: string) => {
    setBooks(books.filter(b => b.id !== bookId))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Books Management</CardTitle>
            <CardDescription>Manage books and subjects for each class</CardDescription>
          </div>
          <Button
            onClick={() => {
              setEditingBook({ id: "", name: "", totalMarks: 100, class: [] })
              setShowBookDialog(true)
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Book
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book Name</TableHead>
                <TableHead>Total Marks</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.name}</TableCell>
                  <TableCell>{book.totalMarks}</TableCell>
                  <TableCell>{book.class.join(", ")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingBook(book)
                          setShowBookDialog(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Add/Edit Book Dialog */}
        <Dialog open={showBookDialog} onOpenChange={setShowBookDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBook?.id ? "Edit Book" : "Add New Book"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleBookSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Book Name</Label>
                  <Input
                    id="name"
                    value={editingBook?.name || ""}
                    onChange={(e) =>
                      setEditingBook(prev => prev ? { ...prev, name: e.target.value } : null)
                    }
                    placeholder="Enter book name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalMarks">Total Marks</Label>
                  <Input
                    id="totalMarks"
                    type="number"
                    value={editingBook?.totalMarks || ""}
                    onChange={(e) =>
                      setEditingBook(prev =>
                        prev ? { ...prev, totalMarks: parseInt(e.target.value) || 0 } : null
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Classes</Label>
                  <Select
                    value={editingBook?.class?.join(",")}
                    onValueChange={(value) =>
                      setEditingBook(prev =>
                        prev ? { ...prev, class: value.split(",") } : null
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nursery,Prep,One,Two,Three,Four,Five">All Classes</SelectItem>
                      <SelectItem value="Nursery,Prep,One,Two">Primary Classes</SelectItem>
                      <SelectItem value="Three,Four,Five">Middle Classes</SelectItem>
                      <SelectItem value="Four,Five">Senior Classes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowBookDialog(false)
                    setEditingBook(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
} 