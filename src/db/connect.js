import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL

if (!MONGO_URI) {
  console.warn('MONGO_URI not set in environment')
}

let cached = global._mongoCached  // eslint-disable-line no-underscore-dangle
if (!cached) {
  cached = global._mongoCached = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not configured')
  }
  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongooseInstance) => {
      return mongooseInstance
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

