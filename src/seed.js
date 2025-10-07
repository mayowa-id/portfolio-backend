import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import Profile from './models/Profile.js'
import Project from './models/Project.js'
import Section from './models/Section.js'
import ContactMessage from './models/ContactMessage.js'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio'
const SEED_FILE = path.join(__dirname, 'seed.json')

async function runSeed() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('connected to mongo for seeding')

    const raw = fs.existsSync(SEED_FILE) ? fs.readFileSync(SEED_FILE, 'utf8') : null
    const seed = raw ? JSON.parse(raw) : {}

    //Profile
    await Profile.deleteMany({})
    await Profile.create({
      name: seed.profile?.name || 'Your Name',
      roles: seed.profile?.roles || ['SOFTWARE ENGINEER'],
      avatar: seed.profile?.avatar || '/avatar.png',
      about: seed.about || '',
      theme: seed.theme || 'dark'
    })

    //Projects
    await Project.deleteMany({})
    if (Array.isArray(seed.projects)) {
      await Project.insertMany(seed.projects.map(p=>({
        title: p.title, description: p.description, image: p.image, github: p.github, date: p.date
      })))
    }

    //Sections (skills, experience, certifications)
    await Section.deleteMany({})
    for (const secName of ['skills','experience','certifications']) {
      const arr = seed[secName] || []
      if (Array.isArray(arr)) {
        for (const f of arr) {
          await Section.create({ sectionName: secName, title: f.title || f.role || '', body: f.body || f.description || f.excerpt || '', image: f.image || null, meta: f.meta || {} })
        }
      } else if (typeof arr === 'string') {
        await Section.create({ sectionName: secName, title: secName, body: arr })
      }
    }

    // Contact messages (start empty)
    await ContactMessage.deleteMany({})
    console.log('seed complete')
    process.exit(0)
  } catch (err) {
    console.error('seed error', err)
    process.exit(1)
  }
}

runSeed()
