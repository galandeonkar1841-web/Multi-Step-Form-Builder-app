require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const formsRouter = require('./routes/forms.routes')
const { notFound, errorHandler } = require('./middleware/errorHandler')

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/forms', formsRouter)

// Error handling
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 FormCraft server running on http://localhost:${PORT}`)
})
