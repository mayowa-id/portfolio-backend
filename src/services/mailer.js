import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@example.com'
const TO_EMAIL = process.env.TO_EMAIL || process.env.FROM_EMAIL

let transporter = null

if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  })
}


export async function sendContactEmail({ name, email, phone, message }) {
  const subject = `Portfolio contact from ${name || email}`
  const text = `From: ${name || 'unknown'} <${email}>\nPhone: ${phone || ''}\n\n${message}`

  if (!transporter) {
    console.log('MAIL (no SMTP configured):', { subject, text })
    return
  }

  await transporter.sendMail({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject,
    text
  })
}
