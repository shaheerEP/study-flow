// pages/api/test-connection.ts
import { checkConnection } from '../../lib/mongodb'

export default async function handler(req, res) {
  const isConnected = await checkConnection()
  res.status(isConnected ? 200 : 500).json({ 
    connected: isConnected 
  })
}