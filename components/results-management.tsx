import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Printer, Search, Save, ArrowUpDown, FileText } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Types
interface Student {
  id: string
  rollNumber: string
  name: string
  class: string
  totalMarks: number
  obtainedMarks: number
  percentage: string
  grade: string
  position: string
  status: string
}

interface Book {
  id: string
  name: string
  totalMarks: number
  class: string[]  // Array of classes this book is for
}

interface StudentMark {
  studentId: string
  bookId: string
  marks: number
}

export function ResultsManagement() {
  // State for marks entry
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [selectedBook, setSelectedBook] = useState<string>("")
  const [studentMarks, setStudentMarks] = useState<StudentMark[]>([])
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [showEmptyCard, setShowEmptyCard] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [selectedCardClass, setSelectedCardClass] = useState<string>("")
  const [selectedTerm, setSelectedTerm] = useState<string>("")
  const [showResultCardDialog, setShowResultCardDialog] = useState(false)
  const [selectedPrintStudent, setSelectedPrintStudent] = useState<string>("")
  const [showBulkPrintDialog, setShowBulkPrintDialog] = useState(false)
  const [bulkPrintClass, setBulkPrintClass] = useState<string>("")
  const [bulkPrintTerm, setBulkPrintTerm] = useState<string>("final")
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [showBookDialog, setShowBookDialog] = useState(false)
  
  // Books data
  const [books, setBooks] = useState<Book[]>([
    { id: "eng", name: "English", totalMarks: 100, class: ["Nursery", "Prep", "One", "Two", "Three", "Four", "Five"] },
    { id: "urdu", name: "Urdu", totalMarks: 100, class: ["Nursery", "Prep", "One", "Two", "Three", "Four", "Five"] },
    { id: "math", name: "Mathematics", totalMarks: 100, class: ["Nursery", "Prep", "One", "Two", "Three", "Four", "Five"] },
    { id: "sci", name: "Science", totalMarks: 100, class: ["Three", "Four", "Five"] },
    { id: "isl", name: "Islamiyat", totalMarks: 100, class: ["One", "Two", "Three", "Four", "Five"] },
    { id: "sst", name: "Social Studies", totalMarks: 100, class: ["Four", "Five"] },
    { id: "comp", name: "Computer", totalMarks: 100, class: ["Three", "Four", "Five"] },
    { id: "draw", name: "Drawing", totalMarks: 50, class: ["Nursery", "Prep", "One", "Two"] },
    { id: "gram", name: "Grammar", totalMarks: 50, class: ["One", "Two", "Three", "Four", "Five"] }
  ])

  // Dummy data for student results with roll numbers
  const studentResults: Student[] = [
    // Nursery Class Students
    { id: "1001", rollNumber: "N001", name: "Ahmed Khan", class: "Nursery", totalMarks: 500, obtainedMarks: 450, percentage: "90.0%", grade: "A+", position: "1st", status: "Pass" },
    { id: "1002", rollNumber: "N002", name: "Zainab Ali", class: "Nursery", totalMarks: 500, obtainedMarks: 425, percentage: "85.0%", grade: "A", position: "2nd", status: "Pass" },
    { id: "1003", rollNumber: "N003", name: "Ibrahim Ahmed", class: "Nursery", totalMarks: 500, obtainedMarks: 410, percentage: "82.0%", grade: "A", position: "3rd", status: "Pass" },
    { id: "1004", rollNumber: "N004", name: "Ayesha Fatima", class: "Nursery", totalMarks: 500, obtainedMarks: 380, percentage: "76.0%", grade: "B+", position: "4th", status: "Pass" },
    { id: "1005", rollNumber: "N005", name: "Omar Farooq", class: "Nursery", totalMarks: 500, obtainedMarks: 365, percentage: "73.0%", grade: "B", position: "5th", status: "Pass" },
    { id: "1006", rollNumber: "N006", name: "Maryam Nawaz", class: "Nursery", totalMarks: 500, obtainedMarks: 355, percentage: "71.0%", grade: "B", position: "6th", status: "Pass" },
    { id: "1007", rollNumber: "N007", name: "Hassan Abdullah", class: "Nursery", totalMarks: 500, obtainedMarks: 340, percentage: "68.0%", grade: "C+", position: "7th", status: "Pass" },
    { id: "1008", rollNumber: "N008", name: "Amina Malik", class: "Nursery", totalMarks: 500, obtainedMarks: 325, percentage: "65.0%", grade: "C", position: "8th", status: "Pass" },
    { id: "1009", rollNumber: "N009", name: "Yusuf Khan", class: "Nursery", totalMarks: 500, obtainedMarks: 315, percentage: "63.0%", grade: "C", position: "9th", status: "Pass" },
    { id: "1010", rollNumber: "N010", name: "Sadia Imam", class: "Nursery", totalMarks: 500, obtainedMarks: 300, percentage: "60.0%", grade: "C", position: "10th", status: "Pass" },
    
    // Prep Class Students
    { id: "2001", rollNumber: "P001", name: "Bilal Ahmed", class: "Prep", totalMarks: 500, obtainedMarks: 475, percentage: "95.0%", grade: "A+", position: "1st", status: "Pass" },
    { id: "2002", rollNumber: "P002", name: "Fatima Hassan", class: "Prep", totalMarks: 500, obtainedMarks: 455, percentage: "91.0%", grade: "A+", position: "2nd", status: "Pass" },
    { id: "2003", rollNumber: "P003", name: "Usman Ali", class: "Prep", totalMarks: 500, obtainedMarks: 440, percentage: "88.0%", grade: "A", position: "3rd", status: "Pass" },
    { id: "2004", rollNumber: "P004", name: "Aisha Khan", class: "Prep", totalMarks: 500, obtainedMarks: 420, percentage: "84.0%", grade: "A", position: "4th", status: "Pass" },
    { id: "2005", rollNumber: "P005", name: "Hamza Malik", class: "Prep", totalMarks: 500, obtainedMarks: 400, percentage: "80.0%", grade: "A", position: "5th", status: "Pass" },
    { id: "2006", rollNumber: "P006", name: "Zara Ahmed", class: "Prep", totalMarks: 500, obtainedMarks: 385, percentage: "77.0%", grade: "B+", position: "6th", status: "Pass" },
    { id: "2007", rollNumber: "P007", name: "Saad Khan", class: "Prep", totalMarks: 500, obtainedMarks: 375, percentage: "75.0%", grade: "B", position: "7th", status: "Pass" },
    { id: "2008", rollNumber: "P008", name: "Hina Fatima", class: "Prep", totalMarks: 500, obtainedMarks: 360, percentage: "72.0%", grade: "B", position: "8th", status: "Pass" },
    { id: "2009", rollNumber: "P009", name: "Ali Hassan", class: "Prep", totalMarks: 500, obtainedMarks: 345, percentage: "69.0%", grade: "C+", position: "9th", status: "Pass" },
    { id: "2010", rollNumber: "P010", name: "Noor Fatima", class: "Prep", totalMarks: 500, obtainedMarks: 330, percentage: "66.0%", grade: "C", position: "10th", status: "Pass" },

    // Class One Students
    { id: "3001", rollNumber: "1001", name: "Muhammad Ali", class: "One", totalMarks: 500, obtainedMarks: 485, percentage: "97.0%", grade: "A+", position: "1st", status: "Pass" },
    { id: "3002", rollNumber: "1002", name: "Sara Ahmad", class: "One", totalMarks: 500, obtainedMarks: 470, percentage: "94.0%", grade: "A+", position: "2nd", status: "Pass" },
    { id: "3003", rollNumber: "1003", name: "Umar Khan", class: "One", totalMarks: 500, obtainedMarks: 455, percentage: "91.0%", grade: "A+", position: "3rd", status: "Pass" },
    { id: "3004", rollNumber: "1004", name: "Amna Ali", class: "One", totalMarks: 500, obtainedMarks: 440, percentage: "88.0%", grade: "A", position: "4th", status: "Pass" },
    { id: "3005", rollNumber: "1005", name: "Zain Hassan", class: "One", totalMarks: 500, obtainedMarks: 425, percentage: "85.0%", grade: "A", position: "5th", status: "Pass" },
    { id: "3006", rollNumber: "1006", name: "Mehwish Khan", class: "One", totalMarks: 500, obtainedMarks: 410, percentage: "82.0%", grade: "A", position: "6th", status: "Pass" },
    { id: "3007", rollNumber: "1007", name: "Fahad Ahmed", class: "One", totalMarks: 500, obtainedMarks: 395, percentage: "79.0%", grade: "B+", position: "7th", status: "Pass" },
    { id: "3008", rollNumber: "1008", name: "Sana Mir", class: "One", totalMarks: 500, obtainedMarks: 380, percentage: "76.0%", grade: "B", position: "8th", status: "Pass" },
    { id: "3009", rollNumber: "1009", name: "Imran Ali", class: "One", totalMarks: 500, obtainedMarks: 365, percentage: "73.0%", grade: "B", position: "9th", status: "Pass" },
    { id: "3010", rollNumber: "1010", name: "Rabia Khan", class: "One", totalMarks: 500, obtainedMarks: 350, percentage: "70.0%", grade: "B", position: "10th", status: "Pass" },

    // Class Two Students
    { id: "4001", rollNumber: "2001", name: "Abdullah Khan", class: "Two", totalMarks: 500, obtainedMarks: 490, percentage: "98.0%", grade: "A+", position: "1st", status: "Pass" },
    { id: "4002", rollNumber: "2002", name: "Ayesha Malik", class: "Two", totalMarks: 500, obtainedMarks: 475, percentage: "95.0%", grade: "A+", position: "2nd", status: "Pass" },
    { id: "4003", rollNumber: "2003", name: "Hassan Ali", class: "Two", totalMarks: 500, obtainedMarks: 460, percentage: "92.0%", grade: "A+", position: "3rd", status: "Pass" },
    { id: "4004", rollNumber: "2004", name: "Sadia Khan", class: "Two", totalMarks: 500, obtainedMarks: 445, percentage: "89.0%", grade: "A", position: "4th", status: "Pass" },
    { id: "4005", rollNumber: "2005", name: "Kamran Ahmed", class: "Two", totalMarks: 500, obtainedMarks: 430, percentage: "86.0%", grade: "A", position: "5th", status: "Pass" },
    { id: "4006", rollNumber: "2006", name: "Nadia Hassan", class: "Two", totalMarks: 500, obtainedMarks: 415, percentage: "83.0%", grade: "A", position: "6th", status: "Pass" },
    { id: "4007", rollNumber: "2007", name: "Faisal Khan", class: "Two", totalMarks: 500, obtainedMarks: 400, percentage: "80.0%", grade: "A", position: "7th", status: "Pass" },
    { id: "4008", rollNumber: "2008", name: "Saima Ali", class: "Two", totalMarks: 500, obtainedMarks: 385, percentage: "77.0%", grade: "B+", position: "8th", status: "Pass" },
    { id: "4009", rollNumber: "2009", name: "Asad Malik", class: "Two", totalMarks: 500, obtainedMarks: 370, percentage: "74.0%", grade: "B", position: "9th", status: "Pass" },
    { id: "4010", rollNumber: "2010", name: "Lubna Khan", class: "Two", totalMarks: 500, obtainedMarks: 355, percentage: "71.0%", grade: "B", position: "10th", status: "Pass" },

    // Class Three Students
    { id: "5001", rollNumber: "3001", name: "Adnan Khan", class: "Three", totalMarks: 500, obtainedMarks: 495, percentage: "99.0%", grade: "A+", position: "1st", status: "Pass" },
    { id: "5002", rollNumber: "3002", name: "Saba Ali", class: "Three", totalMarks: 500, obtainedMarks: 480, percentage: "96.0%", grade: "A+", position: "2nd", status: "Pass" },
    { id: "5003", rollNumber: "3003", name: "Tariq Ahmed", class: "Three", totalMarks: 500, obtainedMarks: 465, percentage: "93.0%", grade: "A+", position: "3rd", status: "Pass" },
    { id: "5004", rollNumber: "3004", name: "Naima Khan", class: "Three", totalMarks: 500, obtainedMarks: 450, percentage: "90.0%", grade: "A+", position: "4th", status: "Pass" },
    { id: "5005", rollNumber: "3005", name: "Kashif Ali", class: "Three", totalMarks: 500, obtainedMarks: 435, percentage: "87.0%", grade: "A", position: "5th", status: "Pass" },
    { id: "5006", rollNumber: "3006", name: "Samina Hassan", class: "Three", totalMarks: 500, obtainedMarks: 420, percentage: "84.0%", grade: "A", position: "6th", status: "Pass" },
    { id: "5007", rollNumber: "3007", name: "Waseem Khan", class: "Three", totalMarks: 500, obtainedMarks: 405, percentage: "81.0%", grade: "A", position: "7th", status: "Pass" },
    { id: "5008", rollNumber: "3008", name: "Farah Ali", class: "Three", totalMarks: 500, obtainedMarks: 390, percentage: "78.0%", grade: "B+", position: "8th", status: "Pass" },
    { id: "5009", rollNumber: "3009", name: "Naveed Malik", class: "Three", totalMarks: 500, obtainedMarks: 375, percentage: "75.0%", grade: "B", position: "9th", status: "Pass" },
    { id: "5010", rollNumber: "3010", name: "Uzma Khan", class: "Three", totalMarks: 500, obtainedMarks: 360, percentage: "72.0%", grade: "B", position: "10th", status: "Pass" },

    // Class Four Students
    { id: "6001", rollNumber: "4001", name: "Salman Khan", class: "Four", totalMarks: 500, obtainedMarks: 492, percentage: "98.4%", grade: "A+", position: "1st", status: "Pass" },
    { id: "6002", rollNumber: "4002", name: "Mehreen Ali", class: "Four", totalMarks: 500, obtainedMarks: 478, percentage: "95.6%", grade: "A+", position: "2nd", status: "Pass" },
    { id: "6003", rollNumber: "4003", name: "Rizwan Ahmed", class: "Four", totalMarks: 500, obtainedMarks: 463, percentage: "92.6%", grade: "A+", position: "3rd", status: "Pass" },
    { id: "6004", rollNumber: "4004", name: "Sana Khan", class: "Four", totalMarks: 500, obtainedMarks: 448, percentage: "89.6%", grade: "A", position: "4th", status: "Pass" },
    { id: "6005", rollNumber: "4005", name: "Junaid Ali", class: "Four", totalMarks: 500, obtainedMarks: 433, percentage: "86.6%", grade: "A", position: "5th", status: "Pass" },
    { id: "6006", rollNumber: "4006", name: "Shabana Hassan", class: "Four", totalMarks: 500, obtainedMarks: 418, percentage: "83.6%", grade: "A", position: "6th", status: "Pass" },
    { id: "6007", rollNumber: "4007", name: "Nasir Khan", class: "Four", totalMarks: 500, obtainedMarks: 403, percentage: "80.6%", grade: "A", position: "7th", status: "Pass" },
    { id: "6008", rollNumber: "4008", name: "Asma Ali", class: "Four", totalMarks: 500, obtainedMarks: 388, percentage: "77.6%", grade: "B+", position: "8th", status: "Pass" },
    { id: "6009", rollNumber: "4009", name: "Sajid Malik", class: "Four", totalMarks: 500, obtainedMarks: 373, percentage: "74.6%", grade: "B", position: "9th", status: "Pass" },
    { id: "6010", rollNumber: "4010", name: "Tehmina Khan", class: "Four", totalMarks: 500, obtainedMarks: 358, percentage: "71.6%", grade: "B", position: "10th", status: "Pass" },

    // Class Five Students
    { id: "7001", rollNumber: "5001", name: "Shahid Khan", class: "Five", totalMarks: 500, obtainedMarks: 498, percentage: "99.6%", grade: "A+", position: "1st", status: "Pass" },
    { id: "7002", rollNumber: "5002", name: "Naheed Ali", class: "Five", totalMarks: 500, obtainedMarks: 483, percentage: "96.6%", grade: "A+", position: "2nd", status: "Pass" },
    { id: "7003", rollNumber: "5003", name: "Arshad Ahmed", class: "Five", totalMarks: 500, obtainedMarks: 468, percentage: "93.6%", grade: "A+", position: "3rd", status: "Pass" },
    { id: "7004", rollNumber: "5004", name: "Saira Khan", class: "Five", totalMarks: 500, obtainedMarks: 453, percentage: "90.6%", grade: "A+", position: "4th", status: "Pass" },
    { id: "7005", rollNumber: "5005", name: "Imtiaz Ali", class: "Five", totalMarks: 500, obtainedMarks: 438, percentage: "87.6%", grade: "A", position: "5th", status: "Pass" },
    { id: "7006", rollNumber: "5006", name: "Shazia Hassan", class: "Five", totalMarks: 500, obtainedMarks: 423, percentage: "84.6%", grade: "A", position: "6th", status: "Pass" },
    { id: "7007", rollNumber: "5007", name: "Qamar Khan", class: "Five", totalMarks: 500, obtainedMarks: 408, percentage: "81.6%", grade: "A", position: "7th", status: "Pass" },
    { id: "7008", rollNumber: "5008", name: "Rukhsana Ali", class: "Five", totalMarks: 500, obtainedMarks: 393, percentage: "78.6%", grade: "B+", position: "8th", status: "Pass" },
    { id: "7009", rollNumber: "5009", name: "Zahid Malik", class: "Five", totalMarks: 500, obtainedMarks: 378, percentage: "75.6%", grade: "B", position: "9th", status: "Pass" },
    { id: "7010", rollNumber: "5010", name: "Shaista Khan", class: "Five", totalMarks: 500, obtainedMarks: 363, percentage: "72.6%", grade: "B", position: "10th", status: "Pass" }
  ]

  // Sort students by roll number
  const sortedStudents = [...studentResults].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.rollNumber.localeCompare(b.rollNumber)
    }
    return b.rollNumber.localeCompare(a.rollNumber)
  })

  // Handle mark input change
  const handleMarkChange = (studentId: string, marks: number) => {
    setStudentMarks(prev => {
      const existing = prev.find(m => m.studentId === studentId && m.bookId === selectedBook)
      if (existing) {
        return prev.map(m => m.studentId === studentId && m.bookId === selectedBook ? { ...m, marks } : m)
      }
      return [...prev, { studentId, bookId: selectedBook, marks }]
    })
  }

  // Handle save marks
  const handleSaveMarks = () => {
    // Here you would implement the API call to save the marks
    console.log('Saving marks:', { bookId: selectedBook, marks: studentMarks })
  }

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
  }

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

  // Get books for selected class
  const getBooksForClass = (className: string) => {
    // Convert class name to match the format in book.class array
    const formattedClassName = className.charAt(0).toUpperCase() + className.slice(1).toLowerCase()
    return books.filter(book => book.class.includes(formattedClassName))
  }

  // Reset selected book when class changes
  const handleClassChange = (newClass: string) => {
    setSelectedClass(newClass)
    setSelectedBook("") // Reset selected book when class changes
    setStudentMarks([]) // Reset marks when class changes
  }

  // Function to handle printing
  const handlePrint = () => {
    window.print()
  }

  // Get selected student data
  const getSelectedStudentData = () => {
    return studentResults.find(student => student.id === selectedStudent)
  }

  // Get student marks for all books
  const getStudentBookMarks = (studentId: string) => {
    return books.map(book => ({
      ...book,
      obtainedMarks: studentMarks.find(m => m.studentId === studentId && m.bookId === book.id)?.marks || 0
    }))
  }

  // Calculate grade based on percentage
  const calculateGrade = (obtainedMarks: number, totalMarks: number) => {
    const percentage = (obtainedMarks / totalMarks) * 100
    if (percentage >= 90) return "A+"
    if (percentage >= 80) return "A"
    if (percentage >= 70) return "B+"
    if (percentage >= 60) return "B"
    if (percentage >= 50) return "C"
    return "F"
  }

  // Function to handle print button click in results list
  const handlePrintClick = (studentId: string) => {
    setSelectedPrintStudent(studentId)
    setSelectedTerm("final") // Default to final term
    setShowResultCardDialog(true)
  }

  // Function to handle bulk printing
  const handleBulkPrint = () => {
    setShowEmptyCard(false)
    setTimeout(handlePrint, 100)
  }

  return (
    <Card className="print:shadow-none print:border-none">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .result-card, .result-card * {
            visibility: visible;
          }
          .result-card {
            break-inside: avoid;
            page-break-after: always;
          }
          .no-print {
            display: none !important;
          }
          @page {
            margin: 0.5cm;
            size: A4 portrait;
          }
        }
      `}</style>

      <CardHeader>
        <CardTitle>Results Management</CardTitle>
        <CardDescription>Manage and view student academic performance</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="results" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="results">Results List</TabsTrigger>
            <TabsTrigger value="entry">Result Entry</TabsTrigger>
            <TabsTrigger value="card">Result Card</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-4 pt-4">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search by student name or ID..." className="pl-8" />
              </div>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="nursery">Nursery</SelectItem>
                  <SelectItem value="prep">Prep</SelectItem>
                  <SelectItem value="one">One</SelectItem>
                  <SelectItem value="two">Two</SelectItem>
                  <SelectItem value="three">Three</SelectItem>
                  <SelectItem value="four">Four</SelectItem>
                  <SelectItem value="five">Five</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline"
                onClick={() => {
                  setBulkPrintClass(selectedClass)
                  setBulkPrintTerm("final")
                  setShowBulkPrintDialog(true)
                }}
                disabled={selectedClass === "all"}
                className="whitespace-nowrap"
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Class Results
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button variant="ghost" onClick={toggleSortOrder} className="h-8 flex items-center gap-1">
                        Roll No
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Total Marks</TableHead>
                    <TableHead>Obtained</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedStudents.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>{result.rollNumber}</TableCell>
                      <TableCell>{result.name}</TableCell>
                      <TableCell>{result.class}</TableCell>
                      <TableCell>{result.totalMarks}</TableCell>
                      <TableCell>{result.obtainedMarks}</TableCell>
                      <TableCell>{result.percentage}</TableCell>
                      <TableCell>{result.grade}</TableCell>
                      <TableCell>{result.position}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            result.status === "Pass"
                              ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300"
                          }
                        >
                          {result.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handlePrintClick(result.id)}
                        >
                            <Printer className="h-4 w-4" />
                          </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="entry" className="space-y-4 pt-4">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Select value={selectedClass} onValueChange={handleClassChange}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="nursery">Nursery</SelectItem>
                  <SelectItem value="prep">Prep</SelectItem>
                  <SelectItem value="one">One</SelectItem>
                  <SelectItem value="two">Two</SelectItem>
                  <SelectItem value="three">Three</SelectItem>
                  <SelectItem value="four">Four</SelectItem>
                  <SelectItem value="five">Five</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={selectedBook} 
                onValueChange={setSelectedBook}
                disabled={selectedClass === "all"}
              >
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder={selectedClass === "all" ? "Select a class first" : "Select book for marks entry"} />
                </SelectTrigger>
                <SelectContent>
                  {selectedClass !== "all" && getBooksForClass(selectedClass).map(book => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.name} (Max: {book.totalMarks})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedClass !== "all" && selectedBook && getBooksForClass(selectedClass).some(book => book.id === selectedBook) && (
              <div className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <Button variant="ghost" onClick={toggleSortOrder} className="h-8 flex items-center gap-1">
                            Roll No
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Marks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedStudents
                        .filter(student => student.class.toLowerCase() === selectedClass.toLowerCase())
                        .map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>{student.rollNumber}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.class}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                max={books.find(b => b.id === selectedBook)?.totalMarks || 100}
                                className="w-20"
                                value={studentMarks.find(m => m.studentId === student.id && m.bookId === selectedBook)?.marks || ""}
                                onChange={(e) => handleMarkChange(student.id, Number(e.target.value))}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveMarks} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Marks
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="card" className="space-y-4 pt-4">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Select value={selectedCardClass} onValueChange={setSelectedCardClass}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nursery">Nursery</SelectItem>
                  <SelectItem value="prep">Prep</SelectItem>
                  <SelectItem value="one">One</SelectItem>
                  <SelectItem value="two">Two</SelectItem>
                  <SelectItem value="three">Three</SelectItem>
                  <SelectItem value="four">Four</SelectItem>
                  <SelectItem value="five">Five</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={selectedStudent} 
                onValueChange={setSelectedStudent}
                disabled={!selectedCardClass}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder={selectedCardClass ? "Select student" : "Select class first"} />
                </SelectTrigger>
                <SelectContent>
                  {studentResults
                    .filter(student => student.class.toLowerCase() === selectedCardClass.toLowerCase())
                    .map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.rollNumber} - {student.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="final">Final Term</SelectItem>
                  <SelectItem value="mid">Mid Term</SelectItem>
                  <SelectItem value="first">First Term</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="w-full md:w-auto"
                    disabled={!selectedStudent || !selectedTerm}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Print Options
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => {
                    setShowEmptyCard(false)
                    setTimeout(handlePrint, 100)
                  }}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print Filled Card
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setShowEmptyCard(true)
                    setTimeout(handlePrint, 100)
                  }}>
                    <FileText className="mr-2 h-4 w-4" />
                    Print Empty Card
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {selectedStudent && selectedTerm && (
              <>
                <Card className="result-card border-2 border-gray-300 dark:border-gray-700">
                  <CardHeader className="text-center border-b pb-4">
                    <div className="flex justify-center mb-2">
                      <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-2xl font-bold">Logo</span>
                      </div>
                    </div>
                    <CardTitle className="text-2xl">SCHOOL NAME</CardTitle>
                    <CardDescription className="text-lg font-medium">
                      RESULT CARD - {selectedTerm.toUpperCase()} TERM 2023-24
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {(() => {
                      const student = getSelectedStudentData()
                      if (!student) return null

                      return (
                        <>
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="space-y-1">
                              <div className="flex">
                                <span className="font-medium w-32">Student ID:</span>
                                <span>{student.id}</span>
                              </div>
                              <div className="flex">
                                <span className="font-medium w-32">Student Name:</span>
                                <span>{student.name}</span>
                              </div>
                              <div className="flex">
                                <span className="font-medium w-32">Roll Number:</span>
                                <span>{student.rollNumber}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex">
                                <span className="font-medium w-32">Class:</span>
                                <span>{student.class}</span>
                              </div>
                              <div className="flex">
                                <span className="font-medium w-32">Term:</span>
                                <span>{selectedTerm}</span>
                              </div>
                              <div className="flex">
                                <span className="font-medium w-32">Session:</span>
                                <span>2023-24</span>
                              </div>
                            </div>
            </div>

            <div className="rounded-md border mb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                                  <TableHead className="text-center">Total Marks</TableHead>
                                  <TableHead className="text-center">Obtained Marks</TableHead>
                                  <TableHead className="text-center">Grade</TableHead>
                                  <TableHead className="text-center">Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                                {getBooksForClass(student.class).map((book) => {
                                  const marks = !showEmptyCard ? studentMarks.find(
                                    m => m.studentId === student.id && m.bookId === book.id
                                  )?.marks : undefined

                                  return (
                                    <TableRow key={book.id}>
                                      <TableCell>{book.name}</TableCell>
                                      <TableCell className="text-center">{book.totalMarks}</TableCell>
                                      <TableCell className="text-center">
                                        {!showEmptyCard ? (marks || "") : (
                                          <div className="h-6 border-b border-dotted border-gray-400 mx-4"></div>
                                        )}
                      </TableCell>
                                      <TableCell className="text-center">
                                        {!showEmptyCard ? (
                                          marks ? calculateGrade(marks, book.totalMarks) : ""
                                        ) : (
                                          <div className="h-6 border-b border-dotted border-gray-400 mx-4"></div>
                                        )}
                      </TableCell>
                                      <TableCell className="text-center">
                                        {!showEmptyCard ? (
                                          marks ? (marks >= book.totalMarks * 0.8 ? "Excellent" : 
                                                 marks >= book.totalMarks * 0.7 ? "Good" : 
                                                 marks >= book.totalMarks * 0.6 ? "Satisfactory" : 
                                                 "Needs Improvement") : ""
                                        ) : (
                                          <div className="h-6 border-b border-dotted border-gray-400 mx-4"></div>
                                        )}
                      </TableCell>
                    </TableRow>
                                  )
                                })}
                </TableBody>
              </Table>
            </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2 border rounded-md p-4">
                              <h3 className="font-bold text-lg mb-2">Result Summary</h3>
                              <div className="grid grid-cols-2 gap-2">
                  <div>
                                  <span className="font-medium">Total Marks:</span>
                                  <span className="ml-2">{student.totalMarks}</span>
                  </div>
                  <div>
                                  <span className="font-medium">Obtained:</span>
                                  <span className="ml-2">
                                    {!showEmptyCard ? student.obtainedMarks : "________"}
                                  </span>
                  </div>
                  <div>
                                  <span className="font-medium">Percentage:</span>
                                  <span className="ml-2">
                                    {!showEmptyCard ? student.percentage : "________"}
                                  </span>
                  </div>
                                <div>
                                  <span className="font-medium">Grade:</span>
                                  <span className="ml-2">
                                    {!showEmptyCard ? student.grade : "________"}
                                  </span>
                </div>
                  <div>
                                  <span className="font-medium">Position:</span>
                                  <span className="ml-2">
                                    {!showEmptyCard ? student.position : "________"}
                                  </span>
                  </div>
                  <div>
                                  <span className="font-medium">Status:</span>
                                  <span className={`ml-2 ${!showEmptyCard ? "text-green-600 font-medium" : ""}`}>
                                    {!showEmptyCard ? student.status : "________"}
                                  </span>
                  </div>
                              </div>
                            </div>

                            <div className="space-y-2 border rounded-md p-4">
                              <h3 className="font-bold text-lg mb-2">Attendance Record</h3>
                              <div className="grid grid-cols-2 gap-2">
                  <div>
                                  <span className="font-medium">Total Days:</span>
                                  <span className="ml-2">90</span>
                  </div>
                                <div>
                                  <span className="font-medium">Present:</span>
                                  <span className="ml-2">{!showEmptyCard ? "85" : "________"}</span>
                </div>
                                <div>
                                  <span className="font-medium">Absent:</span>
                                  <span className="ml-2">{!showEmptyCard ? "5" : "________"}</span>
              </div>
                                <div>
                                  <span className="font-medium">Percentage:</span>
                                  <span className="ml-2">{!showEmptyCard ? "94.4%" : "________"}</span>
            </div>
                              </div>
                            </div>
                          </div>

                          <div className="border rounded-md p-4 mb-6">
                            <h3 className="font-bold text-lg mb-2">Teacher's Remarks</h3>
                            {!showEmptyCard ? (
                              <p>
                                {student.name} has {student.obtainedMarks >= student.totalMarks * 0.8 ? "shown excellent performance" :
                                  student.obtainedMarks >= student.totalMarks * 0.7 ? "performed well" :
                                  student.obtainedMarks >= student.totalMarks * 0.6 ? "shown satisfactory progress" :
                                  "needs to work harder"} throughout the term.
                                {student.obtainedMarks >= student.totalMarks * 0.6 ? " Keep up the good work!" : " More effort is required."}
                              </p>
                            ) : (
                              <div className="h-20 border-b border-dotted border-gray-400"></div>
                            )}
                          </div>

                          <div className="flex justify-between mt-10 pt-6 border-t">
                            <div className="text-center">
                              <div className="border-t border-dashed border-gray-400 dark:border-gray-600 w-32 mx-auto mt-10"></div>
                              <p className="font-medium">Class Teacher</p>
                            </div>
                            <div className="text-center">
                              <div className="border-t border-dashed border-gray-400 dark:border-gray-600 w-32 mx-auto mt-10"></div>
                              <p className="font-medium">Principal</p>
                            </div>
                            <div className="text-center">
                              <div className="border-t border-dashed border-gray-400 dark:border-gray-600 w-32 mx-auto mt-10"></div>
                              <p className="font-medium">Parent's Signature</p>
                            </div>
                          </div>
                        </>
                      )
                    })()}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={showResultCardDialog} onOpenChange={setShowResultCardDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Student Result Card</DialogTitle>
          </DialogHeader>
          <div className="max-h-[80vh] overflow-y-auto">
            {selectedPrintStudent && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                      <SelectItem value="final">Final Term</SelectItem>
                      <SelectItem value="mid">Mid Term</SelectItem>
                      <SelectItem value="first">First Term</SelectItem>
                </SelectContent>
              </Select>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button>
                        <FileText className="mr-2 h-4 w-4" />
                        Print Options
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => {
                        setShowEmptyCard(false)
                        setTimeout(handlePrint, 100)
                      }}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print Filled Card
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setShowEmptyCard(true)
                        setTimeout(handlePrint, 100)
                      }}>
                        <FileText className="mr-2 h-4 w-4" />
                        Print Empty Card
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Result Card Content */}
                <Card className="result-card border-2 border-gray-300 dark:border-gray-700">
                  <CardHeader className="text-center border-b pb-4">
                    <div className="flex justify-center mb-2">
                      <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-2xl font-bold">Logo</span>
                      </div>
                    </div>
                    <CardTitle className="text-2xl">SCHOOL NAME</CardTitle>
                    <CardDescription className="text-lg font-medium">
                      RESULT CARD - {selectedTerm.toUpperCase()} TERM 2023-24
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {(() => {
                      const student = studentResults.find(s => s.id === selectedPrintStudent)
                      if (!student) return null

                      return (
                        <>
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="space-y-1">
                              <div className="flex">
                                <span className="font-medium w-32">Student ID:</span>
                                <span>{student.id}</span>
                              </div>
                              <div className="flex">
                                <span className="font-medium w-32">Student Name:</span>
                                <span>{student.name}</span>
                              </div>
                              <div className="flex">
                                <span className="font-medium w-32">Roll Number:</span>
                                <span>{student.rollNumber}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex">
                                <span className="font-medium w-32">Class:</span>
                                <span>{student.class}</span>
                              </div>
                              <div className="flex">
                                <span className="font-medium w-32">Term:</span>
                                <span>{selectedTerm}</span>
                              </div>
                              <div className="flex">
                                <span className="font-medium w-32">Session:</span>
                                <span>2023-24</span>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-md border mb-6">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Subject</TableHead>
                                  <TableHead className="text-center">Total Marks</TableHead>
                                  <TableHead className="text-center">Obtained Marks</TableHead>
                                  <TableHead className="text-center">Grade</TableHead>
                                  <TableHead className="text-center">Remarks</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {getBooksForClass(student.class).map((book) => {
                                  const marks = !showEmptyCard ? studentMarks.find(
                                    m => m.studentId === student.id && m.bookId === book.id
                                  )?.marks : undefined

                                  return (
                                    <TableRow key={book.id}>
                                      <TableCell>{book.name}</TableCell>
                                      <TableCell className="text-center">{book.totalMarks}</TableCell>
                                      <TableCell className="text-center">
                                        {!showEmptyCard ? (marks || "") : (
                                          <div className="h-6 border-b border-dotted border-gray-400 mx-4"></div>
                                        )}
                                      </TableCell>
                                      <TableCell className="text-center">
                                        {!showEmptyCard ? (
                                          marks ? calculateGrade(marks, book.totalMarks) : ""
                                        ) : (
                                          <div className="h-6 border-b border-dotted border-gray-400 mx-4"></div>
                                        )}
                                      </TableCell>
                                      <TableCell className="text-center">
                                        {!showEmptyCard ? (
                                          marks ? (marks >= book.totalMarks * 0.8 ? "Excellent" : 
                                                 marks >= book.totalMarks * 0.7 ? "Good" : 
                                                 marks >= book.totalMarks * 0.6 ? "Satisfactory" : 
                                                 "Needs Improvement") : ""
                                        ) : (
                                          <div className="h-6 border-b border-dotted border-gray-400 mx-4"></div>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  )
                                })}
                              </TableBody>
                            </Table>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2 border rounded-md p-4">
                              <h3 className="font-bold text-lg mb-2">Result Summary</h3>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <span className="font-medium">Total Marks:</span>
                              <span className="ml-2">{student.totalMarks}</span>
                                </div>
                                <div>
                                  <span className="font-medium">Obtained:</span>
                              <span className="ml-2">
                                {!showEmptyCard ? student.obtainedMarks : "________"}
                              </span>
                                </div>
                                <div>
                                  <span className="font-medium">Percentage:</span>
                              <span className="ml-2">
                                {!showEmptyCard ? student.percentage : "________"}
                              </span>
                                </div>
                                <div>
                                  <span className="font-medium">Grade:</span>
                              <span className="ml-2">
                                {!showEmptyCard ? student.grade : "________"}
                              </span>
                                </div>
                                <div>
                                  <span className="font-medium">Position:</span>
                              <span className="ml-2">
                                {!showEmptyCard ? student.position : "________"}
                              </span>
                                </div>
                                <div>
                                  <span className="font-medium">Status:</span>
                              <span className={`ml-2 ${!showEmptyCard ? "text-green-600 font-medium" : ""}`}>
                                {!showEmptyCard ? student.status : "________"}
                              </span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2 border rounded-md p-4">
                              <h3 className="font-bold text-lg mb-2">Attendance Record</h3>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <span className="font-medium">Total Days:</span>
                                  <span className="ml-2">90</span>
                                </div>
                                <div>
                                  <span className="font-medium">Present:</span>
                              <span className="ml-2">{!showEmptyCard ? "85" : "________"}</span>
                                </div>
                                <div>
                                  <span className="font-medium">Absent:</span>
                              <span className="ml-2">{!showEmptyCard ? "5" : "________"}</span>
                                </div>
                                <div>
                                  <span className="font-medium">Percentage:</span>
                              <span className="ml-2">{!showEmptyCard ? "94.4%" : "________"}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="border rounded-md p-4 mb-6">
                            <h3 className="font-bold text-lg mb-2">Teacher's Remarks</h3>
                              {!showEmptyCard ? (
                                <p>
                                  {student.name} has {student.obtainedMarks >= student.totalMarks * 0.8 ? "shown excellent performance" :
                                    student.obtainedMarks >= student.totalMarks * 0.7 ? "performed well" :
                                    student.obtainedMarks >= student.totalMarks * 0.6 ? "shown satisfactory progress" :
                                    "needs to work harder"} throughout the term.
                                  {student.obtainedMarks >= student.totalMarks * 0.6 ? " Keep up the good work!" : " More effort is required."}
                                </p>
                              ) : (
                                <div className="h-20 border-b border-dotted border-gray-400"></div>
                              )}
                          </div>

                          <div className="flex justify-between mt-10 pt-6 border-t">
                            <div className="text-center">
                              <div className="border-t border-dashed border-gray-400 dark:border-gray-600 w-32 mx-auto mt-10"></div>
                              <p className="font-medium">Class Teacher</p>
                            </div>
                            <div className="text-center">
                              <div className="border-t border-dashed border-gray-400 dark:border-gray-600 w-32 mx-auto mt-10"></div>
                              <p className="font-medium">Principal</p>
                            </div>
                            <div className="text-center">
                              <div className="border-t border-dashed border-gray-400 dark:border-gray-600 w-32 mx-auto mt-10"></div>
                              <p className="font-medium">Parent's Signature</p>
                            </div>
                          </div>
                        </>
                      )
                    })()}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showBulkPrintDialog} onOpenChange={setShowBulkPrintDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Print Class Result Cards</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Select value={bulkPrintTerm} onValueChange={setBulkPrintTerm}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="final">Final Term</SelectItem>
                  <SelectItem value="mid">Mid Term</SelectItem>
                  <SelectItem value="first">First Term</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
                    <FileText className="mr-2 h-4 w-4" />
                    Print Options
              </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => {
                    setShowEmptyCard(false)
                    setTimeout(handlePrint, 100)
                  }}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print Filled Cards
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setShowEmptyCard(true)
                    setTimeout(handlePrint, 100)
                  }}>
                    <FileText className="mr-2 h-4 w-4" />
                    Print Empty Cards
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {studentResults
                .filter(student => student.class.toLowerCase() === bulkPrintClass.toLowerCase())
                .map(student => (
                  <Card key={student.id} className="result-card border-2 border-gray-300 dark:border-gray-700 mb-8 page-break-after-always">
              <CardHeader className="text-center border-b pb-4">
                <div className="flex justify-center mb-2">
                  <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-2xl font-bold">Logo</span>
                  </div>
                </div>
                <CardTitle className="text-2xl">SCHOOL NAME</CardTitle>
                      <CardDescription className="text-lg font-medium">
                        RESULT CARD - {bulkPrintTerm.toUpperCase()} TERM 2023-24
                      </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-1">
                    <div className="flex">
                      <span className="font-medium w-32">Student ID:</span>
                            <span>{student.id}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Student Name:</span>
                            <span>{student.name}</span>
                    </div>
                    <div className="flex">
                            <span className="font-medium w-32">Roll Number:</span>
                            <span>{student.rollNumber}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex">
                      <span className="font-medium w-32">Class:</span>
                            <span>{student.class}</span>
                    </div>
                    <div className="flex">
                            <span className="font-medium w-32">Term:</span>
                            <span>{bulkPrintTerm}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32">Session:</span>
                      <span>2023-24</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border mb-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-center">Total Marks</TableHead>
                        <TableHead className="text-center">Obtained Marks</TableHead>
                        <TableHead className="text-center">Grade</TableHead>
                        <TableHead className="text-center">Remarks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                            {getBooksForClass(student.class).map((book) => {
                              const marks = !showEmptyCard ? studentMarks.find(
                                m => m.studentId === student.id && m.bookId === book.id
                              )?.marks : undefined

                              return (
                                <TableRow key={book.id}>
                                  <TableCell>{book.name}</TableCell>
                                  <TableCell className="text-center">{book.totalMarks}</TableCell>
                                  <TableCell className="text-center">
                                    {!showEmptyCard ? (marks || "") : (
                                      <div className="h-6 border-b border-dotted border-gray-400 mx-4"></div>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {!showEmptyCard ? (
                                      marks ? calculateGrade(marks, book.totalMarks) : ""
                                    ) : (
                                      <div className="h-6 border-b border-dotted border-gray-400 mx-4"></div>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {!showEmptyCard ? (
                                      marks ? (marks >= book.totalMarks * 0.8 ? "Excellent" : 
                                             marks >= book.totalMarks * 0.7 ? "Good" : 
                                             marks >= book.totalMarks * 0.6 ? "Satisfactory" : 
                                             "Needs Improvement") : ""
                                    ) : (
                                      <div className="h-6 border-b border-dotted border-gray-400 mx-4"></div>
                                    )}
                                  </TableCell>
                        </TableRow>
                              )
                            })}
                    </TableBody>
                  </Table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2 border rounded-md p-4">
                    <h3 className="font-bold text-lg mb-2">Result Summary</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="font-medium">Total Marks:</span>
                              <span className="ml-2">{student.totalMarks}</span>
                      </div>
                      <div>
                        <span className="font-medium">Obtained:</span>
                              <span className="ml-2">
                                {!showEmptyCard ? student.obtainedMarks : "________"}
                              </span>
                      </div>
                      <div>
                        <span className="font-medium">Percentage:</span>
                              <span className="ml-2">
                                {!showEmptyCard ? student.percentage : "________"}
                              </span>
                      </div>
                      <div>
                        <span className="font-medium">Grade:</span>
                              <span className="ml-2">
                                {!showEmptyCard ? student.grade : "________"}
                              </span>
                      </div>
                      <div>
                        <span className="font-medium">Position:</span>
                              <span className="ml-2">
                                {!showEmptyCard ? student.position : "________"}
                              </span>
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>
                              <span className={`ml-2 ${!showEmptyCard ? "text-green-600 font-medium" : ""}`}>
                                {!showEmptyCard ? student.status : "________"}
                              </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 border rounded-md p-4">
                    <h3 className="font-bold text-lg mb-2">Attendance Record</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="font-medium">Total Days:</span>
                        <span className="ml-2">90</span>
                      </div>
                      <div>
                        <span className="font-medium">Present:</span>
                              <span className="ml-2">{!showEmptyCard ? "85" : "________"}</span>
                      </div>
                      <div>
                        <span className="font-medium">Absent:</span>
                              <span className="ml-2">{!showEmptyCard ? "5" : "________"}</span>
                      </div>
                      <div>
                        <span className="font-medium">Percentage:</span>
                              <span className="ml-2">{!showEmptyCard ? "94.4%" : "________"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4 mb-6">
                  <h3 className="font-bold text-lg mb-2">Teacher's Remarks</h3>
                        {!showEmptyCard ? (
                          <p>
                            {student.name} has {student.obtainedMarks >= student.totalMarks * 0.8 ? "shown excellent performance" :
                              student.obtainedMarks >= student.totalMarks * 0.7 ? "performed well" :
                              student.obtainedMarks >= student.totalMarks * 0.6 ? "shown satisfactory progress" :
                              "needs to work harder"} throughout the term.
                            {student.obtainedMarks >= student.totalMarks * 0.6 ? " Keep up the good work!" : " More effort is required."}
                          </p>
                        ) : (
                          <div className="h-20 border-b border-dotted border-gray-400"></div>
                        )}
                </div>

                <div className="flex justify-between mt-10 pt-6 border-t">
                  <div className="text-center">
                    <div className="border-t border-dashed border-gray-400 dark:border-gray-600 w-32 mx-auto mt-10"></div>
                    <p className="font-medium">Class Teacher</p>
                  </div>
                  <div className="text-center">
                    <div className="border-t border-dashed border-gray-400 dark:border-gray-600 w-32 mx-auto mt-10"></div>
                    <p className="font-medium">Principal</p>
                  </div>
                  <div className="text-center">
                    <div className="border-t border-dashed border-gray-400 dark:border-gray-600 w-32 mx-auto mt-10"></div>
                    <p className="font-medium">Parent's Signature</p>
                  </div>
                </div>
              </CardContent>
            </Card>
                ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
