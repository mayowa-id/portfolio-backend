import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
dotenv.config({ path: path.join(process.cwd(), '.env') })

import app from './app.js'
import mongoose from 'mongoose'

const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGO_URI || ''

console.log('Starting server...')
console.log('MONGO_URI present?:', !!MONGO_URI)

if (!MONGO_URI) {
  console.warn('MONGO_URI not set. Server will still start for debugging routes.')
  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`))
} else {
  mongoose.set('strictQuery', false)
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB')
      app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`))
    })
    .catch(err => {
      console.error('Mongo connect error:', err.message)
      app.listen(PORT, () => console.log(`Server listening (no DB) on http://localhost:${PORT}`))
    })
}
