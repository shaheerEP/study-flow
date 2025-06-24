"use client"

import { useEffect } from "react"
import { Brain, CheckCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthCallbackPage() {
  useEffect(() => {
    // Simulate processing the OAuth callback
    const processCallback = async () => {
      try {
        // In a real app, you would:
        // 1. Extract the authorization code from URL params
        // 2. Exchange it for access tokens
        // 3. Store user session
        // 4. Redirect to dashboard

        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Redirect to dashboard after successful authentication
        window.location.href = "/"
      } catch (error) {
        console.error("Authentication failed:", error)
        // Redirect back to login on error
        window.location.href = "/login"
      }
    }

    processCallback()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">StudyFlow</h1>
        </div>

        {/* Processing Card */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold">Signing You In</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Authenticated with Google</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Setting up your account...</span>
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please wait while we prepare your personalized study environment.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
