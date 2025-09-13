const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const { authenticateToken } = require("../middleware/auth")

// Public routes
router.post("/signup", authController.signup)
router.post("/login", authController.login)

// Protected routes
router.get("/profile", authenticateToken, authController.getProfile)
router.put("/profile", authenticateToken, authController.updateProfile)
router.put("/change-password", authenticateToken, authController.changePassword)

module.exports = router
