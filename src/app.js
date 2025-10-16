import express from 'express'
import cors from 'cors'
import apiRouter from './routes/api.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use('/api', apiRouter)

app.get('/_health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }))
// Add this route to your Express app
app.post('/api/v1/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Option 1: Log to console (for testing)
    console.log('Contact form submission:', { name, email, message });

    // Option 2: Send email (you'll need nodemailer or similar)
    // await sendEmail(email, name, message);

    // Option 3: Save to database
    // await ContactMessage.create({ name, email, message });

    res.status(200).json({ success: true, message: 'Message received' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to process contact form' });
  }
});


export default app

