import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors({
  origin: '*',
  credentials: true
}))

app.use(express.json())

app.get('/_health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() })
})

app.post('/api/v1/contact', (req, res) => {
  try {
    const { name, email, message, phone } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    console.log('Contact:', { name, email, phone, message })
    res.json({ success: true, message: 'Received' })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Failed' })
  }
})

export default app
