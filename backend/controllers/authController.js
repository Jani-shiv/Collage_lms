const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { User } = require("../models")
const { validateSignup, validateLogin } = require("../utils/validation")

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || "7d" })
}

// Register new user
const signup = async (req, res) => {
  try {
    // Validate input
    const { error } = validateSignup(req.body)
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      })
    }

    const { name, email, password, role, studentId, phone } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      })
    }

    // Check if studentId is provided and unique (for students)
    if (studentId) {
      const existingStudentId = await User.findOne({ where: { studentId } })
      if (existingStudentId) {
        return res.status(400).json({
          message: "Student ID already exists",
        })
      }
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password, // Will be hashed by the model hook
      role: role || "student",
      studentId,
      phone,
    })

    // Generate token
    const token = generateToken(user.id)

    res.status(201).json({
      message: "User registered successfully",
      user: user.toJSON(),
      token,
    })
  } catch (error) {
    console.error("Signup error:", error)
    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    })
  }
}

// Login user
const login = async (req, res) => {
  try {
    // Validate input
    const { error } = validateLogin(req.body)
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      })
    }

    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        message: "Account is deactivated. Please contact administrator.",
      })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      })
    }

    // Generate token
    const token = generateToken(user.id)

    res.json({
      message: "Login successful",
      user: user.toJSON(),
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    })
  }
}

// Get current user profile
const getProfile = async (req, res) => {
  try {
    res.json({
      user: req.user.toJSON(),
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({
      message: "Internal server error",
    })
  }
}

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body
    const userId = req.user.id

    // Update user
    await User.update({ name, phone }, { where: { id: userId } })

    // Get updated user
    const updatedUser = await User.findByPk(userId)

    res.json({
      message: "Profile updated successfully",
      user: updatedUser.toJSON(),
    })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({
      message: "Internal server error",
    })
  }
}

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const userId = req.user.id

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long",
      })
    }

    // Get user with password
    const user = await User.scope("withPassword").findByPk(userId)

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        message: "Current password is incorrect",
      })
    }

    // Update password
    await user.update({ password: newPassword })

    res.json({
      message: "Password changed successfully",
    })
  } catch (error) {
    console.error("Change password error:", error)
    res.status(500).json({
      message: "Internal server error",
    })
  }
}

module.exports = {
  signup,
  login,
  getProfile,
  updateProfile,
  changePassword,
}
