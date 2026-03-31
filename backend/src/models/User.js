const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const userSchema = new mongoose.Schema({
  username:          { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 50 },
  email:             { type: String, required: true, unique: true, trim: true, lowercase: true },
  password:          { type: String, required: true, minlength: 8 },
  displayName:       { type: String, trim: true },
  
  // Additional profile fields
  phone:             { type: String, default: '' },
  bio:               { type: String, default: '' },
  location:          { type: String, default: '' },
  website:           { type: String, default: '' },

  // Platform usernames — saved from SettingsPage
  githubUsername:    { type: String, default: '' },
  leetcodeUsername:  { type: String, default: '' },
  codeforcesHandle:  { type: String, default: '' },
  hackerrankUsername:{ type: String, default: '' },

  role:              { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  enabled:           { type: Boolean, default: true },
  
  // Email verification
  isEmailVerified:   { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },
}, {
  timestamps: true,   // adds createdAt and updatedAt automatically
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare password method
userSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password)
}

// toJSON: remove password from all responses
userSchema.methods.toJSON = function() {
  const obj = this.toObject()
  delete obj.password
  delete obj.__v
  return obj
}

// Virtual: compute initials from displayName or username
userSchema.virtual('initials').get(function() {
  const name = this.displayName || this.username
  return name.slice(0, 2).toUpperCase()
})

module.exports = mongoose.model('User', userSchema)
