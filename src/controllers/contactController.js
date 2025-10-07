import ContactMessage from '../models/ContactMessage.js'
import { sendContactEmail } from '../services/mailer.js'

export async function postContact(req, res) {
  try {
    const { name, email, phone, message } = req.body
    if (!email || !message) return res.status(400).json({ error: 'email and message required' })

    const saved = await ContactMessage.create({ name, email, phone, message })

    try {
      await sendContactEmail({ name, email, phone, message })
    } catch (mailErr) {
      console.warn('mailer error', mailErr)
    }

    res.json({ ok: true, id: saved._id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal' })
  }
}
