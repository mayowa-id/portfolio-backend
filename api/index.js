import express from 'express'
import serverless from 'serverless-http'
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

    console.log('Contact submission received:', { name, email, phone, message })
    
    res.status(200).json({ 
      success: true, 
      message: 'Message received successfully' 
    })
  } catch (error) {
    console.error('Contact error:', error)
    res.status(500).json({ error: 'Failed to process' })
  }
})

const handler = serverless(app)
export default handler
