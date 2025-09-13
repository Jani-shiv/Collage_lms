const express = require("express")
const router = express.Router()
const { User } = require("../models")
const { authenticateToken, requireAdmin } = require("../middleware/auth")
const { Op } = require("sequelize") // Import Op from sequelize

// Get all users (Admin only)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query
    const offset = (page - 1) * limit

    // Build where clause
    const whereClause = {}
    if (role) whereClause.role = role
    if (search) {
      whereClause[Op.or] = [{ name: { [Op.like]: `%${search}%` } }, { email: { [Op.like]: `%${search}%` } }]
    }

    const users = await User.findAndCountAll({
      where: whereClause,
      limit: Number.parseInt(limit),
      offset: Number.parseInt(offset),
      order: [["createdAt", "DESC"]],
    })

    res.json({
      users: users.rows,
      totalUsers: users.count,
      currentPage: Number.parseInt(page),
      totalPages: Math.ceil(users.count / limit),
    })
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Get user by ID (Admin only)
router.get("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json({ user })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Update user (Admin only)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body
    const userId = req.params.id

    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    await user.update({ name, email, role, isActive })

    res.json({
      message: "User updated successfully",
      user: user.toJSON(),
    })
  } catch (error) {
    console.error("Update user error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Delete user (Admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    await user.destroy()
    res.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

module.exports = router
