import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,   // path or URL, e.g. '/ecommerce-diagram.png'
  github: String,
  date: String,
  tags: [String]
}, { timestamps: true })

ProjectSchema.index({ title: 'text', description: 'text' })

export default mongoose.model('Project', ProjectSchema)