import mongoose from 'mongoose'

const ProfileSchema = new mongoose.Schema({
  name: String,
  roles: [String],
  avatar: String,
  about: String,
  theme: { type: String, default: 'dark' } // store theme preference
}, { timestamps: true })

export default mongoose.model('Profile', ProfileSchema)