const sequelize = require("../config/database")
const User = require("./User")
const Course = require("./Course")
const Enrollment = require("./Enrollment")
const Assignment = require("./Assignment")
const Submission = require("./Submission")

// Define associations
User.hasMany(Course, {
  foreignKey: "teacherId",
  as: "taughtCourses",
})
Course.belongsTo(User, {
  foreignKey: "teacherId",
  as: "teacher",
})

// Many-to-many relationship between Users and Courses through Enrollments
User.belongsToMany(Course, {
  through: Enrollment,
  foreignKey: "studentId",
  as: "enrolledCourses",
})
Course.belongsToMany(User, {
  through: Enrollment,
  foreignKey: "courseId",
  as: "students",
})

// Course has many assignments
Course.hasMany(Assignment, {
  foreignKey: "courseId",
  as: "assignments",
})
Assignment.belongsTo(Course, {
  foreignKey: "courseId",
  as: "course",
})

// Assignment has many submissions
Assignment.hasMany(Submission, {
  foreignKey: "assignmentId",
  as: "submissions",
})
Submission.belongsTo(Assignment, {
  foreignKey: "assignmentId",
  as: "assignment",
})

// User has many submissions
User.hasMany(Submission, {
  foreignKey: "studentId",
  as: "submissions",
})
Submission.belongsTo(User, {
  foreignKey: "studentId",
  as: "student",
})

module.exports = {
  sequelize,
  User,
  Course,
  Enrollment,
  Assignment,
  Submission,
}
