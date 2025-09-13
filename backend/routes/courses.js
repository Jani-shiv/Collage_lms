const express = require("express")
const router = express.Router()
const { Course, User, Enrollment } = require("../models")
const { authenticateToken, requireTeacherOrAdmin } = require("../middleware/auth")

// Get all courses
router.get("/", authenticateToken, async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          as: "teacher",
          attributes: ["id", "name", "email"],
        },
      ],
      where: { isActive: true },
      order: [["createdAt", "DESC"]],
    })

    res.json({ courses })
  } catch (error) {
    console.error("Get courses error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Get course by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "teacher",
          attributes: ["id", "name", "email"],
        },
        {
          model: User,
          as: "students",
          attributes: ["id", "name", "email", "studentId"],
          through: { attributes: ["enrollmentDate", "grade", "status"] },
        },
      ],
    })

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    res.json({ course })
  } catch (error) {
    console.error("Get course error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Create new course (Teacher/Admin only)
router.post("/", authenticateToken, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { title, description, courseCode, credits, semester, year, maxStudents } = req.body

    // For teachers, set teacherId to current user
    const teacherId = req.user.role === "teacher" ? req.user.id : req.body.teacherId

    const course = await Course.create({
      title,
      description,
      courseCode,
      credits,
      semester,
      year,
      teacherId,
      maxStudents,
    })

    const courseWithTeacher = await Course.findByPk(course.id, {
      include: [
        {
          model: User,
          as: "teacher",
          attributes: ["id", "name", "email"],
        },
      ],
    })

    res.status(201).json({
      message: "Course created successfully",
      course: courseWithTeacher,
    })
  } catch (error) {
    console.error("Create course error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Enroll in course (Student only)
router.post("/:id/enroll", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can enroll in courses" })
    }

    const courseId = req.params.id
    const studentId = req.user.id

    // Check if course exists
    const course = await Course.findByPk(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      where: { studentId, courseId },
    })

    if (existingEnrollment) {
      return res.status(400).json({ message: "Already enrolled in this course" })
    }

    // Create enrollment
    await Enrollment.create({ studentId, courseId })

    res.json({ message: "Successfully enrolled in course" })
  } catch (error) {
    console.error("Enroll course error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

module.exports = router
