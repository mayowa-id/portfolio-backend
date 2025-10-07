import Profile from '../models/Profile.js'

export async function getProfile(req, res) {
  try {
    let profile = await Profile.findOne().lean()
    if (!profile) {
      profile = await Profile.create({
        name: 'Your Name',
        roles: ['SOFTWARE ENGINEER'],
        avatar: '/avatar.png',
        about: ''
      })
    }
    res.json(profile)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal' })
  }
}

export async function updateProfile(req, res) {
  try {
    const token = req.headers['x-admin-token'] || req.body.adminToken
    if (!token || token !== process.env.ADMIN_TOKEN) return res.status(401).json({ error: 'unauthorized' })

    const data = req.body
    const updated = await Profile.findOneAndUpdate({}, { $set: data }, { upsert: true, new: true })
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal' })
  }
}