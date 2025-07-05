export interface User {
  _id?: string
  email: string
  name: string
  image?: string
  googleId?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserData {
  email: string
  name: string
  image?: string
  googleId?: string
}