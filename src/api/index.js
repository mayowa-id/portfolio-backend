import serverless from 'serverless-http'
import app from '../src/app.js'          // adjust path if your app is in a different place
import { connectToDatabase } from '../src/db/connect.js'

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'https://geranio.xyz'

import cors from 'cors'
app.use(cors({ origin: (origin, cb) => {
  if (!origin || origin === FRONTEND_ORIGIN) return cb(null, true)
  return cb(null, true)
}}))

app.use((req, res, next) => next())

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

