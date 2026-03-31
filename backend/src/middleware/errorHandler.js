const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(409).json({
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already taken`
    })
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message)
    return res.status(400).json({ message: messages.join(', ') })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' })
  }

  // Platform fetch errors
  if (err.isPlatformError) {
    return res.status(503).json({ message: err.message })
  }

  // Generic
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected error occurred'
  })
}

module.exports = errorHandler
