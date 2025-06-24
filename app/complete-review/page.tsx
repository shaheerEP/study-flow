"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Copy,
  Archive,
  Trash2,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"

// Sample content data for today's review
const todaysContent = [
  {
    id: 1,
    title: "JavaScript Closures and Scope",
    content: `A **closure** is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. Closures are created every time a function is created, at function creation time.

**Key Points:**
• Inner functions have access to outer function variables
• Variables remain accessible even after outer function returns
• Commonly used in ==module patterns== and *event handlers*
• Essential for maintaining state in functional programming

**Example:**
\`\`\`javascript
function outerFunction(x) {
  return function innerFunction(y) {
    return x + y; // x is still accessible
  };
}
\`\`\``,
    subject: { name: "JavaScript", color: "bg-yellow-500" },
    reviewStage: "daily",
    scheduledDate: "2024-01-15",
    addedDate: "2024-01-10",
    difficulty: "medium",
    estimatedTime: "3 min",
  },
  {
    id: 2,
    title: "React useEffect Dependencies",
    content: `The **dependency array** in useEffect determines when the effect runs:

**Dependency Array Rules:**
• **Empty array []**: Effect runs once after initial render
• **No array**: Effect runs after every render  
• **With dependencies**: Effect runs when dependencies change

**Best Practices:**
• Always include all values from component scope used inside the effect
• Use ESLint plugin to catch missing dependencies
• Consider using ==useCallback== and ==useMemo== for complex dependencies

**Common Pitfall:**
Missing dependencies can lead to stale closures and bugs.`,
    subject: { name: "React", color: "bg-blue-500" },
    reviewStage: "weekly",
    scheduledDate: "2024-01-15",
    addedDate: "2024-01-08",
    difficulty: "hard",
    estimatedTime: "4 min",
  },
  {
    id: 3,
    title: "CSS Grid vs Flexbox",
    content: `**CSS Grid** is for ==two-dimensional== layouts, while **Flexbox** is for *one-dimensional* layouts:

**CSS Grid:**
• Controls both rows and columns simultaneously
• Better for complex, two-dimensional layouts
• Use for page-level layouts
• Properties: grid-template-columns, grid-template-rows

**Flexbox:**
• Controls either row OR column (one dimension)
• Better for component-level layouts
• Use for navigation bars, card layouts
• Properties: flex-direction, justify-content, align-items

**When to Use:**
• Grid: Page layouts, complex forms
• Flexbox: Navigation, buttons, simple card layouts`,
    subject: { name: "CSS", color: "bg-purple-500" },
    reviewStage: "monthly",
    scheduledDate: "2024-01-15",
    addedDate: "2024-01-05",
    difficulty: "easy",
    estimatedTime: "2 min",
  },
  {
    id: 4,
    title: "Database Normalization Principles",
    content: `**Database normalization** is the process of organizing data to reduce redundancy and improve data integrity.

**Normal Forms:**
• **1NF**: Eliminate repeating groups, atomic values only
• **2NF**: 1NF + eliminate partial dependencies
• **3NF**: 2NF + eliminate transitive dependencies
• **BCNF**: 3NF + eliminate remaining anomalies

**Benefits:**
• Reduces data redundancy
• Improves data consistency
• Easier maintenance and updates
• Better storage efficiency

**Trade-offs:**
• May require more complex queries (joins)
• Can impact read performance
• Balance normalization with query performance needs`,
    subject: { name: "Database", color: "bg-green-500" },
    reviewStage: "weekly",
    scheduledDate: "2024-01-15",
    addedDate: "2024-01-03",
    difficulty: "hard",
    estimatedTime: "5 min",
  },
  {
    id: 5,
    title: "HTTP Status Codes",
    content: `**HTTP status codes** indicate the result of HTTP requests:

**2xx Success:**
• 200 OK - Request successful
• 201 Created - Resource created successfully
• 204 No Content - Successful, no content to return

**4xx Client Errors:**
• 400 Bad Request - Invalid request syntax
• 401 Unauthorized - Authentication required
• 403 Forbidden - Access denied
• 404 Not Found - Resource not found

**5xx Server Errors:**
• 500 Internal Server Error - Generic server error
• 502 Bad Gateway - Invalid response from upstream
• 503 Service Unavailable - Server temporarily unavailable

**Best Practices:**
• Use appropriate codes for different scenarios
• Provide meaningful error messages
• Handle errors gracefully in client applications`,
    subject: { name: "Web Development", color: "bg-orange-500" },
    reviewStage: "daily",
    scheduledDate: "2024-01-15",
    addedDate: "2024-01-12",
    difficulty: "medium",
    estimatedTime: "3 min",
  },
]

export default function CompleteReviewPage() {
  const router = useRouter()
  const [previewMode, setPreviewMode] = useState(false)
  const [archivedItems, setArchivedItems] = useState<number[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)
  const [deletedItems, setDeletedItems] = useState<number[]>([])

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const activeItems = todaysContent.filter(
    (item) => !archivedItems.includes(item.id) && !deletedItems.includes(item.id),
  )

  const totalEstimatedTime = activeItems.reduce((total, item) => {
    const minutes = Number.parseInt(item.estimatedTime.split(" ")[0])
    return total + minutes
  }, 0)

  const renderContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/==(.*?)==/g, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>')
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        '<pre class="bg-muted p-3 rounded-md overflow-x-auto"><code class="text-sm font-mono">$2</code></pre>',
      )
      .replace(/^• (.+)$/gm, '<li class="ml-4">$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul class="list-disc space-y-1 my-2">$1</ul>')
      .replace(/\n\n/g, '</p><p class="mb-3">')
      .replace(/^(.+)$/, '<p class="mb-3">$1</p>')
  }

  const handleCopyItem = async (item: (typeof todaysContent)[0]) => {
    const textContent = `${item.title}\n\n${item.content}`
    try {
      await navigator.clipboard.writeText(textContent)
      toast({
        title: "Copied to clipboard",
        description: `"${item.title}" has been copied to your clipboard.`,
      })
    } catch (err) {
      console.error("Failed to copy:", err)
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCopyAll = async () => {
    const allContent = activeItems.map((item) => `${item.title}\n\n${item.content}\n\n---\n\n`).join("")

    try {
      await navigator.clipboard.writeText(allContent)
      toast({
        title: "All content copied",
        description: `${activeItems.length} items have been copied to your clipboard.`,
      })
    } catch (err) {
      console.error("Failed to copy all:", err)
      toast({
        title: "Copy failed",
        description: "Unable to copy all content. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleArchiveItem = (itemId: number) => {
    setArchivedItems([...archivedItems, itemId])
    const item = todaysContent.find((item) => item.id === itemId)
    toast({
      title: "Item archived",
      description: `"${item?.title}" has been archived.`,
    })
  }

  const handleDeleteItem = (itemId: number) => {
    setItemToDelete(itemId)
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (itemToDelete) {
      setDeletedItems([...deletedItems, itemToDelete])
      const item = todaysContent.find((item) => item.id === itemToDelete)
      toast({
        title: "Item deleted",
        description: `"${item?.title}" has been permanently deleted.`,
      })
      setItemToDelete(null)
      setShowDeleteDialog(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "daily":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "weekly":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "monthly":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "yearly":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Complete Review</h1>
              <p className="text-muted-foreground flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {today}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
              className={previewMode ? "bg-primary/10 border-primary" : ""}
            >
              {previewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {previewMode ? "Hide Controls" : "Show Controls"}
            </Button>
            {previewMode && (
              <Button variant="outline" size="sm" onClick={handleCopyAll}>
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </Button>
            )}
          </div>
        </div>

        {/* Summary Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-lg font-semibold">{activeItems.length}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Time</p>
                  <p className="text-lg font-semibold">{totalEstimatedTime} minutes</p>
                </div>
              </div>
          
            </div>
          </CardContent>
        </Card>

        {/* Content Items */}
        <div className="space-y-6">
          {activeItems.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">All Done!</h3>
                <p className="text-muted-foreground">You've completed all your reviews for today. Great job!</p>
                <Button className="mt-4" onClick={() => router.push("/")}>
                  Return to Dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            activeItems.map((item, index) => (
              <Card key={item.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                        <Badge className={`${item.subject.color} text-white`}>{item.subject.name}</Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Scheduled: {new Date(item.scheduledDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{item.estimatedTime}</span>
                        </div>
                        <Badge variant="outline" className={getStageColor(item.reviewStage)}>
                          {item.reviewStage}
                        </Badge>
                       
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {previewMode && (
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyItem(item)}
                          title="Copy to clipboard"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleArchiveItem(item.id)}
                          title="Archive item"
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                          title="Delete item"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderContent(item.content) }}
                  />
                </CardContent>

                {index < activeItems.length - 1 && <Separator className="mt-6" />}
              </Card>
            ))
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span>Delete Item</span>
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to permanently delete this item? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {itemToDelete && (
              <Alert className="border-destructive/20 bg-destructive/5">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <AlertDescription>
                  <strong>"{todaysContent.find((item) => item.id === itemToDelete)?.title}"</strong> will be permanently
                  deleted from your study library.
                </AlertDescription>
              </Alert>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete Permanently
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
