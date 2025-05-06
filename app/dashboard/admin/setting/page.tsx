"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import * as z from "zod"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Save, Upload, School, Phone, MapPin, Trash, Info, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define the schema for school settings form
const schoolSettingsSchema = z.object({
  schoolName: z.string().min(2, {
    message: "School name must be at least 2 characters.",
  }),
  schoolAddress: z.string().min(5, {
    message: "School address must be at least 5 characters.",
  }),
  primaryPhone: z.string().min(10, {
    message: "Primary phone number must be at least 10 digits.",
  }),
  secondaryPhone: z.string().optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal("")),
})

type SchoolSettingsFormValues = z.infer<typeof schoolSettingsSchema>

export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  
  // Initialize form with default values
  const form = useForm<SchoolSettingsFormValues>({
    resolver: zodResolver(schoolSettingsSchema),
    defaultValues: {
      schoolName: "",
      schoolAddress: "",
      primaryPhone: "",
      secondaryPhone: "",
      email: "",
      website: "",
    },
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

  // Load existing settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true)
      try {
        // Simulate API call to fetch school settings
        // Replace with actual API call when backend is available
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data - replace with actual API response
        const mockSettings = {
          schoolName: "Global Excellence Academy",
          schoolAddress: "123 Education Street, Knowledge City, 54000",
          primaryPhone: "+92123456789",
          secondaryPhone: "+92198765432",
          email: "info@globalexcellence.edu",
          website: "https://www.globalexcellence.edu",
          logoUrl: "/school-logo.png"
        }
        
        // Set form values
        form.reset({
          schoolName: mockSettings.schoolName,
          schoolAddress: mockSettings.schoolAddress,
          primaryPhone: mockSettings.primaryPhone,
          secondaryPhone: mockSettings.secondaryPhone,
          email: mockSettings.email,
          website: mockSettings.website,
        })
        
        // Set logo preview if available
        if (mockSettings.logoUrl) {
          setLogoPreview(mockSettings.logoUrl)
        }
      } catch (error) {
        console.error("Error loading settings:", error)
        toast.error("Failed to load settings")
      } finally {
        setIsLoading(false)
      }
    }
    
    loadSettings()
  }, [form])

  // Handle logo file selection
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Logo file size should not exceed 5MB")
        return
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file")
        return
      }
      
      setLogoFile(file)
      const fileReader = new FileReader()
      fileReader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      fileReader.readAsDataURL(file)
    }
  }

  // Handle form submission
  const onSubmit = async (data: SchoolSettingsFormValues) => {
    setIsLoading(true)
    try {
      // Simulate API call to save settings
      // Replace with actual API call when backend is available
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Handle logo upload if file is selected
      if (logoFile) {
        // Upload logic would go here
        console.log("Logo file to upload:", logoFile)
      }
      
      console.log("Submitted settings:", data)
      toast.success("School settings updated successfully")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to update settings")
    } finally {
      setIsLoading(false)
    }
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
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
          onClick={() => router.push("/dashboard/admin")}
          variant="ghost"
          className="mb-4 flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">School Settings</h2>
        <p className="text-muted-foreground">
          Manage your school information and contact details
        </p>
      </motion.div>

      {/* General Information Section */}
      <motion.div variants={itemVariants}>
        <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2"><School className="h-5 w-5" /> General Information</h3>
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            The school name and logo will appear on reports, certificates, and communications sent to parents and students.
          </AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5" />
              School Identity
            </CardTitle>
            <CardDescription>
              Update your school name and logo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="schoolName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter school name" {...field} />
                      </FormControl>
                      <FormDescription>
                        The official name of your educational institution
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <Label htmlFor="logo-upload">School Logo</Label>
                  <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row">
                    <div className="flex h-32 w-32 items-center justify-center rounded-md border border-dashed">
                      {logoPreview ? (
                        <div className="relative h-28 w-28">
                          <Avatar className="h-28 w-28">
                            <AvatarImage src={logoPreview} alt="School logo" />
                            <AvatarFallback>Logo</AvatarFallback>
                          </Avatar>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                            onClick={removeLogo}
                            type="button"
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <School className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Button asChild variant="outline" type="button">
                          <label htmlFor="logo-upload" className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Logo
                          </label>
                        </Button>
                        <Input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Recommended size: 512x512px. Max 5MB. PNG or JPG format.
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Information Section */}
      <motion.div variants={itemVariants}>
        <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2"><MapPin className="h-5 w-5" /> Contact Information</h3>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Contact Details
            </CardTitle>
            <CardDescription>
              Update your school address and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="schoolAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter complete school address" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="primaryPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., +92123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="secondaryPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., +92123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., info@school.edu" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., https://www.school.edu" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-end">
        <Button 
          onClick={form.handleSubmit(onSubmit)} 
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </span>
          )}
        </Button>
      </motion.div>
    </motion.div>
  )
}
