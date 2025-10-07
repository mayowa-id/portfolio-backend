import Project from '../models/Project.js'

export async function listProjects(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10))
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit || '6', 10)))
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      Project.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Project.countDocuments()
    ])
    res.json({ data, page, limit, total })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal' })
  }
}

export async function getProject(req, res) {
  try {
    const id = req.params.id
    const p = await Project.findById(id).lean()
    if (!p) return res.status(404).json({ error: 'not found' })
    res.json(p)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal' })
  }
}

export async function createProject(req, res) {
  try {
    const token = req.headers['x-admin-token'] || req.body.adminToken
    if (!token || token !== process.env.ADMIN_TOKEN) return res.status(401).json({ error: 'unauthorized' })

    const payload = req.body
    const p = await Project.create(payload)
    res.json(p)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal' })
  }
}
