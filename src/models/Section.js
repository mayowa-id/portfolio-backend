import mongoose from 'mongoose'
const SectionSchema = new mongoose.Schema({
  sectionName: { type: String, required: true, index: true }, // e.g. "skills", "experience"
  title: String,
  body: String,
  image: String,
  meta: mongoose.Schema.Types.Mixed
}, { timestamps: true })

export default mongoose.model('Section', SectionSchema)