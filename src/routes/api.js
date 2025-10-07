import express from 'express'
const router = express.Router()

router.get('/ping', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString(), env: process.env.NODE_ENV || 'dev' })
})

async function safeImport(path) {
  try {
    const mod = await import(path)
    return mod
  } catch (err) {
    console.error('Failed to import', path, err && err.message)
    return null
  }
}

let profileController = null
let projectsController = null
let sectionsController = null
let contactController = null

await Promise.all([
  safeImport('../controllers/profileController.js').then(m => profileController = m),
  safeImport('../controllers/projectsController.js').then(m => projectsController = m),
  safeImport('../controllers/sectionsController.js').then(m => sectionsController = m),
  safeImport('../controllers/contactController.js').then(m => contactController = m)
])

// Profile routes
if (profileController && profileController.getProfile) {
  router.get('/profile', profileController.getProfile)
} else {
  router.get('/profile', (req, res) => res.status(500).json({ error: 'profile controller not loaded' }))
}
if (profileController && profileController.updateProfile) {
  router.post('/profile', profileController.updateProfile)
}

// Projects
if (projectsController && projectsController.listProjects) {
  router.get('/projects', projectsController.listProjects)
  router.get('/projects/:id', projectsController.getProject)
  router.post('/projects', projectsController.createProject)
} else {
  router.get('/projects', (req,res)=> res.status(500).json({ error: 'projects controller not loaded' }))
}

// Sections (skills, experience, certifications)
if (sectionsController && sectionsController.listSection && sectionsController.addSectionFrame) {
  router.get('/sections/:name', sectionsController.listSection)
  router.post('/sections/:name', sectionsController.addSectionFrame)
} else {
  router.get('/sections/:name', (req,res)=> res.status(500).json({ error: 'sections controller not loaded' }))
}

// Contact endpoints
if (contactController && contactController.postContact) {
  router.post('/contact', contactController.postContact)
} else {
  router.post('/contact', (req,res)=> res.status(500).json({ error: 'contact controller not loaded' }))
}

router.get('/contacts', async (req, res) => {
  try {
    if (profileController && profileController._getProfileForContacts) {
      const data = await profileController._getProfileForContacts()
      return res.json(data)
    }
  } catch (err) {
    console.warn('contacts helper failed', err && err.message)
  }
  res.json({})
})
router.get('/theme', async (req,res) => {
  try {
    if (profileController && profileController.getTheme) {
      return profileController.getTheme(req,res)
    }
  } catch (err) {
    console.warn('get theme error', err && err.message)
  }
  res.json({ theme: 'dark' })
})
router.post('/theme', async (req,res) => {
  try {
    if (profileController && profileController.setTheme) return profileController.setTheme(req,res)
  } catch (err) {
    console.warn('set theme error', err && err.message)
  }
  res.status(500).json({ error: 'theme controller not available' })
})

export default router
