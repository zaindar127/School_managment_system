"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "@/components/mode-toggle"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

export default function LoginPage() {
  const router = useRouter()
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // Dummy users data
  const users = [
    { id: "admin1", password: "admin123", role: "admin", name: "Admin User" },
    { id: "teacher1", password: "teacher123", role: "teacher", name: "John Smith", class: "Two" },
    { id: "teacher2", password: "teacher123", role: "teacher", name: "Sarah Johnson", class: "Four" },
    { id: "student1", password: "student123", role: "student", name: "Muhammad Muheeb", class: "Two" },
    { id: "student2", password: "student123", role: "student", name: "Ayesha Khan", class: "Four" },
  ]

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const user = users.find((u) => u.id === userId && u.password === password)

    if (user) {
      // Store user info in localStorage for session management
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          name: user.name,
          role: user.role,
          class: user.class || null,
        }),
      )

      // Redirect based on role
      if (user.role === "admin") {
        router.push("/dashboard/admin")
      } else if (user.role === "teacher") {
        router.push("/dashboard/teacher")
      } else if (user.role === "student") {
        router.push("/dashboard/student")
      }
    } else {
      setError("Invalid user ID or password")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">School Management System</CardTitle>
          <CardDescription className="text-center">Enter your credentials to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              {error && (
                <Alert variant="destructive">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid gap-2">
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter your user ID"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-muted-foreground text-center">
            
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
