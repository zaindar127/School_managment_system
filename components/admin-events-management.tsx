"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Trash2, Plus, Bell, Calendar as CalendarIcon, ClipboardList } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

// Define the Event interface
export interface Event {
  id: number
  title: string
  date: string
  description: string
  type: "academic" | "celebration" | "meeting" | "exam" | "other"
}

export function AdminEventsManagement() {
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<Event[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newEvent, setNewEvent] = useState<Omit<Event, "id">>({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    description: "",
    type: "other"
  })
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Load demo events on component mount
  useEffect(() => {
    // Demo events data - this will be replaced with API call later
    const demoEvents: Event[] = [
      {
        id: 1,
        title: "Final Term Exams",
        date: "2024-05-15",
        description: "End of term examinations for all classes",
        type: "exam" as const
      },
      {
        id: 2,
        title: "Parent-Teacher Meeting",
        date: "2024-05-20",
        description: "Discussing student progress with parents",
        type: "meeting" as const
      },
      {
        id: 3,
        title: "Annual Sports Day",
        date: "2024-05-25",
        description: "School-wide sports competitions",
        type: "celebration" as const
      }
    ]
    
    // Simulate API loading
    const timer = setTimeout(() => {
      setEvents(demoEvents)
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      toast.error("Please fill in all required fields")
      return
    }

    // In a real application, this would be an API call
    const newId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1
    const eventToAdd = { ...newEvent, id: newId }
    
    // Update local state (would be handled by API response in production)
    setEvents([...events, eventToAdd])
    setShowAddDialog(false)
    setNewEvent({
      title: "",
      date: format(new Date(), "yyyy-MM-dd"),
      description: "",
      type: "other"
    })
    
    toast.success("Event added successfully (Demo Mode)")
  }

  const handleDeleteEvent = (id: number) => {
    // In a real application, this would be an API call
    setEvents(events.filter(event => event.id !== id))
    toast.success("Event deleted successfully (Demo Mode)")
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "academic":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "celebration":
        return "bg-green-50 text-green-700 border-green-200"
      case "meeting":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "exam":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-sm hover:shadow-md transition-all duration-300">        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Events Management</CardTitle>
              <CardDescription>Manage school events and important dates</CardDescription>
            </div>
            
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="gap-1 w-full sm:w-auto">
                  <Plus className="h-4 w-4 shrink-0" />
                  <span className="truncate">Add Event</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                  <DialogDescription>
                    Create a new event for the school calendar
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input 
                      id="title" 
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      placeholder="e.g. Parent-Teacher Meeting" 
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="date">Event Date *</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="date" 
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="icon">
                            <CalendarIcon className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <CalendarComponent
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                              setSelectedDate(date)
                              if (date) {
                                setNewEvent({
                                  ...newEvent,
                                  date: format(date, "yyyy-MM-dd")
                                })
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="type">Event Type</Label>
                    <select
                      id="type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({...newEvent, type: e.target.value as any})}
                    >
                      <option value="academic">Academic</option>
                      <option value="celebration">Celebration</option>
                      <option value="meeting">Meeting</option>
                      <option value="exam">Exam</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      placeholder="Provide details about the event" 
                      rows={3}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                  <Button onClick={handleAddEvent}>Add Event</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="upcoming" className="w-full">            <TabsList className="mb-6 w-full sm:w-auto grid grid-cols-2 sm:grid-cols-none sm:flex gap-2">
              <TabsTrigger value="upcoming" className="flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4 shrink-0" />
                <span className="truncate">Upcoming Events</span>
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center justify-center gap-2">
                <ClipboardList className="h-4 w-4 shrink-0" />
                <span className="truncate">All Events</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              <div className="space-y-4">
                <AnimatePresence>
                  {events
                    .filter(event => new Date(event.date) >= new Date())
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3 }}
                      >                        <Card className="hover:shadow-md transition-all duration-300">
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 w-full">
                              <div className="flex flex-1 min-w-0">
                                <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0 mr-4">
                                  <Calendar className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0 overflow-hidden">
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-lg truncate max-w-full sm:max-w-[300px]">{event.title}</h3>
                                    <Badge variant="outline" className={`${getEventTypeColor(event.type)} shrink-0`}>
                                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {format(new Date(event.date), "MMMM d, yyyy")}
                                  </p>
                                  <p className="text-sm mt-2 line-clamp-2 text-ellipsis overflow-hidden">{event.description}</p>
                                </div>
                              </div>
                              <div className="shrink-0 self-start sm:self-center">
                                <Button 
                                  variant="destructive" 
                                  size="icon"
                                  onClick={() => handleDeleteEvent(event.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                    
                  {events.filter(event => new Date(event.date) >= new Date()).length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Bell className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium">No upcoming events</h3>
                      <p className="mt-1">Click the "Add Event" button to create a new event</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </TabsContent>
            
            <TabsContent value="all">
              <div className="space-y-4">
                <AnimatePresence>
                  {events
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3 }}
                        className={
                          new Date(event.date) < new Date()
                            ? "opacity-70"
                            : ""
                        }
                      >                        <Card className="hover:shadow-md transition-all duration-300">
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 w-full">
                              <div className="flex flex-1 min-w-0">
                                <div className={`h-12 w-12 rounded-md flex items-center justify-center shrink-0 mr-4 ${
                                  new Date(event.date) < new Date()
                                    ? "bg-gray-200 text-gray-500"
                                    : "bg-primary/10 text-primary"
                                }`}>
                                  <Calendar className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0 overflow-hidden">
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-lg truncate max-w-full sm:max-w-[300px]">{event.title}</h3>
                                    <Badge variant="outline" className={`${getEventTypeColor(event.type)} shrink-0`}>
                                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                    </Badge>
                                    {new Date(event.date) < new Date() && (
                                      <Badge variant="outline" className="bg-gray-100 text-gray-700 shrink-0">
                                        Past
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {format(new Date(event.date), "MMMM d, yyyy")}
                                  </p>
                                  <p className="text-sm mt-2 line-clamp-2 text-ellipsis overflow-hidden">{event.description}</p>
                                </div>
                              </div>
                              <div className="shrink-0 self-start sm:self-center">
                                <Button 
                                  variant="destructive" 
                                  size="icon"
                                  onClick={() => handleDeleteEvent(event.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                    
                  {events.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium">No events found</h3>
                      <p className="mt-1">Click the "Add Event" button to create a new event</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Total Events: {events.length} ({events.filter(event => new Date(event.date) >= new Date()).length} upcoming)
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  )
}