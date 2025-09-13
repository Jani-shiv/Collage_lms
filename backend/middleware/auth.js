const jwt = require("jsonwebtoken")
const { User } = require("../models")

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        message: "Access token required",
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user from database
    const user = await User.findByPk(decoded.userId)
    if (!user || !user.isActive) {
      return res.status(401).json({
        message: "Invalid token or user not found",
      })
    }

    // Add user to request object
    req.user = user
    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    return res.status(403).json({
      message: "Invalid or expired token",
    })
  }
}

// Middleware to check user roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Insufficient permissions",
      })
    }

    next()
  }
}

// Middleware to check if user is admin
const requireAdmin = authorizeRoles("admin")

// Middleware to check if user is teacher or admin
const requireTeacherOrAdmin = authorizeRoles("teacher", "admin")

module.exports = {
  authenticateToken,
  authorizeRoles,
  requireAdmin,
  requireTeacherOrAdmin,
}
