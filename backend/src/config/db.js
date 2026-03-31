const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL
    const dbName = process.env.DB_NAME
    
    // For MongoDB Atlas (mongodb+srv://), don't append /{dbName}
    // For local MongoDB (mongodb://), append /{dbName}
    const connectionString = mongoUrl.includes('mongodb+srv')
      ? mongoUrl
      : `${mongoUrl}/${dbName}`
    
    await mongoose.connect(connectionString)
    console.log('MongoDB connected to', dbName)
  } catch (err) {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  }
}

module.exports = connectDB
