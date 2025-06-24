"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Brain, Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate checking authentication status
    const checkAuth = async () => {
      try {
        // In a real app, you would check:
        // 1. Valid JWT token in localStorage/cookies
        // 2. Token expiration
        // 3. User session with your backend

        await new Promise((resolve) => setTimeout(resolve, 1000))

        // For demo purposes, randomly determine auth status
        // In production, this would be a real auth check
        const isLoggedIn = localStorage.getItem("studyflow_auth") === "true"

        setIsAuthenticated(isLoggedIn)
      } catch (error) {
        console.error("Auth check failed:", error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="p-3 bg-primary rounded-full">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Loading StudyFlow...</p>
          </div>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
    return null
  }

  // Render protected content if authenticated
  return <>{children}</>
}
