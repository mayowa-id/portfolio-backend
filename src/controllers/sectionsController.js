import Section from '../models/Section.js'

// returns paginated frames for a section (skills/experience/certifications)

export async function listSection(req, res) {
  try {
    const name = req.params.name
    const page = Math.max(1, parseInt(req.query.page || '1', 10))
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit || '6', 10)))
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      Section.find({ sectionName: name }).sort({ createdAt: 1 }).skip(skip).limit(limit).lean(),
      Section.countDocuments({ sectionName: name })
    ])

    res.json({ data, page, limit, total })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal' })
  }
}

export async function addSectionFrame(req, res) {
  try {
    const token = req.headers['x-admin-token'] || req.body.adminToken
    if (!token || token !== process.env.ADMIN_TOKEN) return res.status(401).json({ error: 'unauthorized' })

    const name = req.params.name
    const payload = req.body
    const doc = await Section.create({ sectionName: name, ...payload })
    res.json(doc)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal' })
  }
}
