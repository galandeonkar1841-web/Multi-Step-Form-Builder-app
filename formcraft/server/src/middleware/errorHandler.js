// 404 handler
const notFound = (req, res, next) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` })
}

// Global error handler
const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

module.exports = { notFound, errorHandler }
