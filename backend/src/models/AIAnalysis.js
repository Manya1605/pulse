const mongoose = require('mongoose')

const aiAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  
  // Analyzed data
  platforms: {
    github: { type: Boolean, default: false },
    leetcode: { type: Boolean, default: false },
    codeforces: { type: Boolean, default: false },
    hackerrank: { type: Boolean, default: false },
  },
  
  // Platform stats snapshot at time of analysis
  platformStats: {
    github: mongoose.Schema.Types.Mixed,
    leetcode: mongoose.Schema.Types.Mixed,
    codeforces: mongoose.Schema.Types.Mixed,
    hackerrank: mongoose.Schema.Types.Mixed,
  },
  
  // AI-generated analysis text
  analysis: {
    type: String,
    required: true,
  },
  
  // Model used for analysis
  model: {
    type: String,
    default: 'mistral',
  },
  
  // Tags for organizing analyses
  tags: {
    type: [String],
    default: [],
  },
  
  // Metadata
  isAIGenerated: {
    type: Boolean,
    default: true,
  },
  
  generatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt
})

// Index for efficient querying
aiAnalysisSchema.index({ userId: 1, createdAt: -1 })
aiAnalysisSchema.index({ username: 1 })

module.exports = mongoose.model('AIAnalysis', aiAnalysisSchema)
