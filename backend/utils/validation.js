const Joi = require("joi")

// Validation schema for user signup
const signupSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("student", "teacher", "admin").default("student"),
  studentId: Joi.string().optional(),
  phone: Joi.string().optional(),
})

// Validation schema for user login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

// Validation schema for course creation
const courseSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().optional(),
  courseCode: Joi.string().min(3).max(20).required(),
  credits: Joi.number().integer().min(1).max(6).default(3),
  semester: Joi.string().valid("Fall", "Spring", "Summer").required(),
  year: Joi.number().integer().min(2020).max(2030).required(),
  teacherId: Joi.number().integer().optional(),
  maxStudents: Joi.number().integer().min(1).default(30),
})

const validateSignup = (data) => signupSchema.validate(data)
const validateLogin = (data) => loginSchema.validate(data)
const validateCourse = (data) => courseSchema.validate(data)

module.exports = {
  validateSignup,
  validateLogin,
  validateCourse,
}
