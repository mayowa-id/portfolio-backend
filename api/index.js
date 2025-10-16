import serverless from 'serverless-http'
import app from '../src/app.js'

const FRONTEND_ORIGIN = 'https://mayowaportfolio.geraniol.xyz'

import cors from 'cors'
app.use(cors({
  origin: '*',
  credentials: true
}))

app.post('/api/v1/contact', async (req, res) => {
  try {
    const { name, email, message, phone } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    console.log('Contact submission:', { name, email, message })
    res.status(200).json({ success: true, message: 'Message received' })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Failed to process contact form' })
  }
})

const handler = serverless(app)

export default handler
