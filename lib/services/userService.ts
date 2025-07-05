// lib/services/userService.ts
import clientPromise from '@/lib/mongodb'

const UserService = {
  async findByEmail(email: string) {
    try {
      const client = await clientPromise
      const db = client.db() // Your database name
      return await db.collection('users').findOne({ email })
    } catch (error) {
      console.error('Error finding user by email:', error)
      throw error
    }
  },

  async createUser(userData: any) {
    try {
      const client = await clientPromise
      const db = client.db() // Your database name
      const result = await db.collection('users').insertOne(userData)
      return result.insertedId
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }
}

export default UserService