const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")

// Load environment variables
dotenv.config()

// Import database connection
const db = require("./config/database")

// Import routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const courseRoutes = require("./routes/courses")

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/courses", courseRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ message: "College LMS Backend is running!" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await db.authenticate()
    console.log("✅ Database connected successfully")

    // Sync database models (create tables if they don't exist)
    await db.sync({ force: false })
    console.log("✅ Database synchronized")

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📚 College LMS Backend ready at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error("❌ Unable to start server:", error)
    process.exit(1)
  }
}

startServer()

module.exports = app
