"use client"

import { useState, useEffect, useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Save, School, MapPin, Info, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSession } from "@clerk/nextjs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { updateSchoolSettings } from "@/db/actions/school"
import { getAdminSchoolByClerkId } from "@/db/actions/admin_school"
import SchoolLogoUploader from "@/components/SchoolLogoUploader"
import { uploadToCloudinary } from '@/lib/cloudinary';
import { TextShimmerWave } from "@/components/ui/text-shimmer-wave"
import { completeOnboarding } from "@/db/actions/clerk"

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
  website: z.string()
    .refine((val) => {
      if (!val) return true; // Allow empty string
      // Add http:// if not present
      const url = val.startsWith('http://') || val.startsWith('https://') 
        ? val 
        : `https://${val}`;
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }, {
      message: "Please enter a valid website URL (e.g., school.com or https://school.com)",
    })
    .optional()
    .or(z.literal("")),
})

type SchoolSettingsFormValues = z.infer<typeof schoolSettingsSchema>

export default function SettingsPage() {
  const { session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [showOnboardingDialog, setShowOnboardingDialog] = useState(false)
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [currentLogo, setCurrentLogo] = useState<string | null>(null)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null)
  const [shouldRemoveLogo, setShouldRemoveLogo] = useState(false)
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Loading school data...")
  
  // Initialize form with empty values
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

  // Memoize fetchSchoolData with useCallback
  const fetchSchoolData = useCallback(async () => {
    if (!session?.user?.id) return;
    
    try {
      setIsInitialLoading(true);
      // Show loading overlay with appropriate message
      setShowLoadingOverlay(true);
      setLoadingMessage("Loading school data...");
      
      const result = await getAdminSchoolByClerkId(session.user.id);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      const adminSchool = result.data;
      if (adminSchool && adminSchool.schoolId) {
        console.log('School data to populate form:', adminSchool.school);
        
        // Set school ID and logo
        setSchoolId(adminSchool.schoolId);
        setCurrentLogo(adminSchool.school?.logo || null);
        
        // Reset form with school data, ensuring undefined values are converted to empty strings
        form.reset({
          schoolName: adminSchool.school?.name || "",
          schoolAddress: adminSchool.school?.address || "",
          primaryPhone: adminSchool.school?.primaryPhone || "",
          secondaryPhone: adminSchool.school?.secondaryPhone || "",
          email: adminSchool.school?.email || "",
          website: adminSchool.school?.website || "",
        }, { keepValues: false }); // Use false to ensure values are updated from DB
        
        toast.success("School data loaded successfully");
      } else {
        toast.warning("No school data found");
      }
    } catch (error) {
      console.error('Error fetching school data:', error);
      toast.error("Failed to load school data");
    } finally {
      setIsInitialLoading(false);
      // Hide loading overlay
      setShowLoadingOverlay(false);
    }
  }, [session?.user?.id]); // Only session?.user?.id as dependency

  // Fetch school data on component mount
  useEffect(() => {
    if (session?.user?.id) {
      fetchSchoolData();
    }
  }, [session?.user?.id, fetchSchoolData]);
  
  // Check if user is in onboarding process
  useEffect(() => {
    const onboarding = session?.user?.publicMetadata?.onboarding as boolean | undefined
    if (onboarding === true) {
      setShowOnboardingDialog(true)
    }
  }, [session])
  
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

  // Modify the handleLogoFileSelect function
  const handleLogoFileSelect = (file: File | null) => {
    // Only update state, don't trigger any form submission
    if (file) {
      console.log("File selected, updating state without submitting form", file.name);
      // Use requestAnimationFrame to ensure UI updates before any state changes
      requestAnimationFrame(() => {
        setSelectedLogoFile(file);
        setShouldRemoveLogo(false);
      });
    }
  };
 
  // Modify the handleLogoRemove function
  const handleLogoRemove = () => {
    console.log("Logo removal requested, updating state without submitting form");
    // Use requestAnimationFrame to ensure UI updates before any state changes
    requestAnimationFrame(() => {
      setSelectedLogoFile(null);
      setShouldRemoveLogo(true);
    });
  };

  // Handle form submission using a form handler instead of onSubmit directly
  const handleSubmitForm = form.handleSubmit(async (data: SchoolSettingsFormValues) => {
    if (!schoolId) {
      toast.error("School ID not found");
      return;
    }

    // Show loading overlay with appropriate message
    setShowLoadingOverlay(true);
    setLoadingMessage("Saving changes...");
    setIsLoading(true);
    
    try {
      let logoUrl: string | undefined = undefined;

      // Handle logo upload if there's a new file
      if (selectedLogoFile) {
        setLoadingMessage("Uploading logo...");
        const uploadedUrl = await uploadToCloudinary(selectedLogoFile, 'school_logos');
        logoUrl = uploadedUrl;
      }

      // Format website URL if needed
      let formattedWebsite = data.website;
      if (formattedWebsite && !formattedWebsite.match(/^https?:\/\//)) {
        formattedWebsite = `https://${formattedWebsite}`;
      }

      setLoadingMessage("Updating school settings...");
      // Update school settings including logo
      const result = await updateSchoolSettings(schoolId, {
        name: data.schoolName,
        address: data.schoolAddress,
        primaryPhone: data.primaryPhone,
        secondaryPhone: data.secondaryPhone,
        email: data.email,
        website: formattedWebsite || undefined,
        logo: shouldRemoveLogo ? "" : (logoUrl || undefined), // Remove logo if shouldRemoveLogo is true
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // Update local state with the new data
      if (result.updatedData) {
        // Update form values if they were changed
        if (result.updatedData.name !== undefined) {
          form.setValue('schoolName', result.updatedData.name);
        }
        if (result.updatedData.address !== undefined) {
          form.setValue('schoolAddress', result.updatedData.address);
        }
        if (result.updatedData.primaryPhone !== undefined) {
          form.setValue('primaryPhone', result.updatedData.primaryPhone);
        }
        if (result.updatedData.secondaryPhone !== undefined) {
          form.setValue('secondaryPhone', result.updatedData.secondaryPhone || '');
        }
        if (result.updatedData.email !== undefined) {
          form.setValue('email', result.updatedData.email);
        }
        if (result.updatedData.website !== undefined) {
          form.setValue('website', result.updatedData.website || '');
        }
        if (result.updatedData.logo !== undefined) {
          setCurrentLogo(result.updatedData.logo || null);
        }
      }

      // Reset logo-related states
      setSelectedLogoFile(null);
      setShouldRemoveLogo(false);

      // Update onboarding status in Clerk metadata
      setLoadingMessage("Completing setup...");
      const onboardingResult = await completeOnboarding();
      
      if (!onboardingResult.success) {
        console.error("Failed to update onboarding status:", onboardingResult.error);
        // Don't throw error here, as school settings were saved successfully
        toast.warning("School settings saved, but onboarding status could not be updated");
      } else {
        // Close the onboarding dialog if it's open
        setShowOnboardingDialog(false);
        toast.success("School settings updated successfully. You can now access all features.");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setIsLoading(false);
      // Hide loading overlay
      setShowLoadingOverlay(false);
    }
  });

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <TextShimmerWave className="text-2xl font-medium" duration={1.2}>
            Loading school data...
          </TextShimmerWave>
        </div>
      </div>
    );
  }

  return (
    <>
      {showLoadingOverlay && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <TextShimmerWave 
              className="text-2xl font-medium" 
              duration={1.2}
            >
              {loadingMessage}
            </TextShimmerWave>
          </div>
        </div>
      )}

      <Dialog open={showOnboardingDialog} onOpenChange={setShowOnboardingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to the School Management System</DialogTitle>
            <DialogDescription>
              Complete your school profile to get started. This information is required
              before you can access other parts of the system.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 pt-2">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Required First-Time Setup</AlertTitle>
              <AlertDescription>
                Please provide your school name, contact information, and logo (optional).
                After saving these details, you&apos;ll be able to access all administrative features.
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">
              Tip: You can update this information anytime from the Settings page.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowOnboardingDialog(false)}>
              Got it, let&apos;s get started
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* General Information Section */}
        <motion.div variants={itemVariants}>
          <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <School className="h-5 w-5" /> 
            General Information
            <Button 
              variant="outline" 
              size="icon" 
              className="ml-2 h-8 w-8" 
              onClick={() => fetchSchoolData()}
              disabled={isInitialLoading || isLoading}
              title="Refresh school data"
            >
              <RefreshCw className={`h-4 w-4 ${isInitialLoading ? 'animate-spin' : ''}`} />
            </Button>
          </h3>
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
                School Identity & Contact Information
              </CardTitle>
              <CardDescription>
                Update your school profile, contact, and logo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={handleSubmitForm} className="space-y-6">
                  {/* School Name */}
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
                  {/* School Logo */}
                  <SchoolLogoUploader 
                    currentLogo={currentLogo}
                    onFileSelect={handleLogoFileSelect}
                    onRemove={handleLogoRemove}
                    disabled={isLoading}
                  />
                  {/* School Address */}
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
                  {/* Phones */}
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
                  {/* Email & Website */}
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
                  {/* Save Button */}
                  <div className="flex justify-end">
                    <Button 
                      disabled={isLoading}
                      className="min-w-[120px]"
                      type="submit"
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
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </>
  )
}