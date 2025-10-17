import express from 'express'
import serverless from 'serverless-http'
import cors from 'cors'

const app = express()

app.use(cors({
  origin: '*',
}))

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Portfolio API is running' })
})

app.get('/_health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() })
})

app.post('/api/v1/contact', (req, res) => {
  try {
    const { name, email, message, phone } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    console.log('Contact received:', { name, email, phone, message })
    res.json({ success: true, message: 'Message received' })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Failed to process' })
  }
})

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

export default serverless(app)
