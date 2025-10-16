import serverless from 'serverless-http'
import app from '../src/app.js'
import { connectToDatabase } from '../src/db/connect.js'
import { sendContactEmail } from '../src/mailer.js'
import cors from 'cors'

const FRONTEND_ORIGIN = 'https://mayowaportfolio.geraniol.xyz'

app.use(cors({ 
  origin: (origin, cb) => {
    // Allow your domain, localhost, and no origin (same-site requests)
    if (!origin || origin === FRONTEND_ORIGIN || origin.includes('localhost')) {
      return cb(null, true)
    }
    return cb(null, true) // Temporarily allow all for testing
  },
  credentials: true
}))

app.post('/api/v1/contact', async (req, res) => {
  try {
    const { name, email, message, phone } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    console.log('Contact form submission:', { name, email, phone, message })

    try {
      await sendContactEmail({ 
        name, 
        email, 
        phone: phone || '',
        message 
      })
      console.log('Email sent successfully')
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
    }

    res.status(200).json({ success: true, message: 'Message received' })
  } catch (error) {
    console.error('Contact form error:', error)
    res.status(500).json({ error: 'Failed to process contact form' })
  }
})

let connectPromise = null
async function ensureDb() {
  if (!connectPromise) connectPromise = connectToDatabase()
  return connectPromise
}

const handler = serverless(app)

export default async function (req, res) {
  try {
    await ensureDb()
  } catch (err) {
    console.error('DB connect error in serverless function:', err && err.message)
  }
  return handler(req, res)
}
