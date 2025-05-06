"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, FileText, GraduationCap, Bell, Clock, ArrowRight, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import type { Event } from "./admin-events-management"

interface TeacherEvent extends Event {
  reminder: boolean
}

export function TeacherUpcomingEvents() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<TeacherEvent[]>([])

  // Load events from localStorage on component mount
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      // Get school events from localStorage (added by admin)
      const storedEvents = localStorage.getItem("schoolEvents")
      
      // Get teacher alerts (events marked as alerts by this teacher)
      const teacherAlerts = localStorage.getItem("teacherEventAlerts")
      const alertIds = teacherAlerts ? new Set(JSON.parse(teacherAlerts)) : new Set()
      
      if (storedEvents) {
        const schoolEvents = JSON.parse(storedEvents)
        // Convert admin events to teacher events with reminder flag
        const teacherEvents = schoolEvents.map((event: Event) => ({
          ...event,
          reminder: alertIds.has(event.id)
        }))
        setEvents(teacherEvents)
      } else {
        // Fallback to default events if no events found in localStorage
        setEvents([
          {
            id: 1,
            title: "Final Term Exams",
            date: "2024-05-15",
            description: "End of term examinations for all classes",
            type: "exam",
            reminder: false,
          },
          {
            id: 2,
            title: "Result Submission Deadline",
            date: "2024-06-01",
            description: "Submit all student results by this date",
            type: "academic",
            reminder: true,
          },
          {
            id: 3,
            title: "Parent-Teacher Meeting",
            date: "2024-06-10",
            description: "Meeting with parents to discuss student progress",
            type: "meeting",
            reminder: false,
          },
          {
            id: 4,
            title: "Annual Day Celebration",
            date: "2024-06-15",
            description: "School annual day celebrations",
            type: "celebration",
            reminder: false,
          },
        ])
      }

      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  // Toggle reminder for an event
  const toggleReminder = (id: number) => {
    const updatedEvents = events.map(event => 
      event.id === id ? { ...event, reminder: !event.reminder } : event
    )
    setEvents(updatedEvents)
    
    // Update localStorage with events marked as alerts
    const alertIds = updatedEvents
      .filter(event => event.reminder)
      .map(event => event.id)
    localStorage.setItem("teacherEventAlerts", JSON.stringify(alertIds))
    
    // Show toast notification
    const event = events.find(e => e.id === id)
    if (event) {
      toast({
        title: event.reminder ? "Reminder removed" : "Alert set",
        description: `${event.reminder ? "Removed" : "Set"} alert for ${event.title} on ${format(new Date(event.date), "MMM d, yyyy")}`,
        variant: event.reminder ? "destructive" : "default",
      })
    }
  }

  // Get appropriate icon based on event type
  const getEventIcon = (type: string) => {
    switch (type) {
      case "academic": return FileText
      case "celebration": return GraduationCap
      case "meeting": return Calendar
      case "exam": return AlertCircle
      default: return Calendar
    }
  }

  // Get color class based on event type
  const getColorClass = (type: string) => {
    switch (type) {
      case "academic": return "bg-blue-500/10 text-blue-500"
      case "celebration": return "bg-green-500/10 text-green-500"
      case "meeting": return "bg-purple-500/10 text-purple-500"
      case "exam": return "bg-red-500/10 text-red-500"
      default: return "bg-primary/10 text-primary"
    }
  }

  // Sort events: alerts first, then by date
  const sortedEvents = [...events]
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => {
      // Sort by reminder status first
      if (a.reminder && !b.reminder) return -1
      if (!a.reminder && b.reminder) return 1
      
      // Then sort by date
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
    .slice(0, 5) // Show only 5 most relevant events

  if (loading) {
    return (
      <Card className="h-full shadow-sm">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-40 mb-1" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full shadow-sm hover:shadow transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Upcoming Events</CardTitle>
          <CardDescription>School events and important dates</CardDescription>
        </div>
        <Badge variant="outline" className="px-3 py-1 bg-primary/5">
          <Clock className="mr-1 h-3 w-3" /> 
          {events.filter(e => new Date(e.date) >= new Date()).length} events
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <AnimatePresence>
          {sortedEvents.length > 0 ? (
            sortedEvents.map((event) => {
              const EventIcon = getEventIcon(event.type)
              return (
                <motion.div 
                  key={event.id}
                  whileHover={{ scale: 1.02, x: 5 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-start gap-4 p-2 rounded-lg hover:bg-muted/50 cursor-pointer ${
                    event.reminder ? "bg-primary/5 border border-primary/20" : ""
                  }`}
                >
                  <div className={`rounded-md p-2 ${getColorClass(event.type)}`}>
                    <EventIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{event.title}</p>
                      <Badge variant="outline" className="text-xs">
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.date), "MMM d, yyyy")}
                    </p>
                  </div>
                  <Button 
                    variant={event.reminder ? "destructive" : "outline"} 
                    size="sm"
                    onClick={() => toggleReminder(event.id)}
                    className="rounded-full h-8 w-8 p-0"
                    title={event.reminder ? "Remove alert" : "Set alert"}
                  >
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">Toggle reminder</span>
                  </Button>
                </motion.div>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Bell className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground font-medium">No upcoming events</p>
              <p className="text-xs text-muted-foreground mt-1">
                Events added by admin will appear here
              </p>
            </div>
          )}
        </AnimatePresence>

        <Button variant="ghost" size="sm" className="w-full mt-2 gap-1">
          View all events <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
