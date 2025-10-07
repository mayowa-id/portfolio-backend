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

export default app
