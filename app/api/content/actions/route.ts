import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import clientPromise from '@/lib/mongodb'
import { ContentDocument } from '@/lib/models/content'
import { authOptions } from "@/lib/auth"
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, contentId } = body

    if (!action || !contentId) {
      return NextResponse.json({ error: 'Action and contentId are required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('spaced_repetition')
    const collection = db.collection<ContentDocument>('contents')

    const objectId = new ObjectId(contentId)

    switch (action) {
      case 'archive':
        await collection.updateOne(
          { _id: objectId, userId: session.user.id },
          { 
            $set: { 
              isActive: false, 
              updatedAt: new Date() 
            } 
          }
        )
        return NextResponse.json({ success: true, message: 'Content archived' })

      case 'delete':
        await collection.deleteOne({ _id: objectId, userId: session.user.id })
        return NextResponse.json({ success: true, message: 'Content deleted' })

      case 'review':
        const { difficulty } = body
        
        // Get user's repetition flow
        const userCollection = db.collection('users')
        const user = await userCollection.findOne({ _id: session.user.id })
        const repetitionFlow = user?.repetitionFlow || [2, 4, 7, 7, 7, 30, 30, 30, 130, 130, 130, 365, 365, 365]

        // Get current content
        const content = await collection.findOne({ _id: objectId, userId: session.user.id })
        if (!content) {
          return NextResponse.json({ error: 'Content not found' }, { status: 404 })
        }

        let nextReviewIndex = content.reviewCount
        
        // Adjust based on difficulty
        if (difficulty === 'easy' && nextReviewIndex < repetitionFlow.length - 1) {
          nextReviewIndex += 1
        } else if (difficulty === 'hard' && nextReviewIndex > 0) {
          nextReviewIndex = Math.max(0, nextReviewIndex - 1)
        }

        const daysToAdd = repetitionFlow[Math.min(nextReviewIndex, repetitionFlow.length - 1)]
        const nextReviewDate = new Date()
        nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd)

        await collection.updateOne(
          { _id: objectId, userId: session.user.id },
          { 
            $set: { 
              reviewCount: content.reviewCount + 1,
              nextReviewDate,
              difficulty,
              updatedAt: new Date() 
            } 
          }
        )

        return NextResponse.json({ 
          success: true, 
          message: 'Review recorded',
          nextReviewDate 
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Content action error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}