const { User, Course, Enrollment } = require("../models")
const bcrypt = require("bcryptjs")

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...")

    // Clear existing data
    await Enrollment.destroy({ where: {} })
    await Course.destroy({ where: {} })
    await User.destroy({ where: {} })

    console.log("🧹 Cleared existing data")

    // Create sample users
    const users = []
    
    // Admin user
    const admin = await User.create({
      name: "System Administrator",
      email: "admin@college.edu",
      password: "password123",
      role: "admin",
      phone: "+1-555-0001",
      isActive: true,
    })
    users.push(admin)
    
    // Teachers
    const teacher1 = await User.create({
      name: "Dr. Sarah Johnson",
      email: "teacher@college.edu",
      password: "password123",
      role: "teacher",
      phone: "+1-555-0002",
      isActive: true,
    })
    users.push(teacher1)
    
    const teacher2 = await User.create({
      name: "Prof. Michael Chen",
      email: "mchen@college.edu",
      password: "password123",
      role: "teacher",
      phone: "+1-555-0003",
      isActive: true,
    })
    users.push(teacher2)
    
    const teacher3 = await User.create({
      name: "Dr. Emily Rodriguez",
      email: "erodriguez@college.edu",
      password: "password123",
      role: "teacher",
      phone: "+1-555-0004",
      isActive: true,
    })
    users.push(teacher3)
    
    // Students
    const student1 = await User.create({
      name: "John Smith",
      email: "student@college.edu",
      password: "password123",
      role: "student",
      studentId: "STU001",
      phone: "+1-555-1001",
      isActive: true,
    })
    users.push(student1)
    
    const student2 = await User.create({
      name: "Emma Wilson",
      email: "ewilson@student.college.edu",
      password: "password123",
      role: "student",
      studentId: "STU002",
      phone: "+1-555-1002",
      isActive: true,
    })
    users.push(student2)
    
    const student3 = await User.create({
      name: "David Brown",
      email: "dbrown@student.college.edu",
      password: "password123",
      role: "student",
      studentId: "STU003",
      phone: "+1-555-1003",
      isActive: true,
    })
    users.push(student3)
    
    const student4 = await User.create({
      name: "Lisa Garcia",
      email: "lgarcia@student.college.edu",
      password: "password123",
      role: "student",
      studentId: "STU004",
      phone: "+1-555-1004",
      isActive: true,
    })
    users.push(student4)
    
    const student5 = await User.create({
      name: "Alex Thompson",
      email: "athompson@student.college.edu",
      password: "password123",
      role: "student",
      studentId: "STU005",
      phone: "+1-555-1005",
      isActive: true,
    })
    users.push(student5)
    
    const student6 = await User.create({
      name: "Maria Lopez",
      email: "mlopez@student.college.edu",
      password: "password123",
      role: "student",
      studentId: "STU006",
      phone: "+1-555-1006",
      isActive: true,
    })
    users.push(student6)

    console.log("👥 Created sample users")

    // Get teacher IDs for course assignment
    const teachers = users.filter((user) => user.role === "teacher")
    const students = users.filter((user) => user.role === "student")

    // Create sample courses
    const courses = await Course.bulkCreate([
      {
        title: "Introduction to Computer Science",
        description:
          "Fundamental concepts of computer science including programming basics, algorithms, and data structures. Perfect for beginners with no prior programming experience.",
        courseCode: "CS101",
        credits: 4,
        semester: "Fall",
        year: 2024,
        teacherId: teachers[0].id,
        maxStudents: 30,
        isActive: true,
      },
      {
        title: "Data Structures and Algorithms",
        description:
          "Advanced study of data structures, algorithm design, and analysis. Covers arrays, linked lists, trees, graphs, sorting, and searching algorithms.",
        courseCode: "CS201",
        credits: 4,
        semester: "Spring",
        year: 2024,
        teacherId: teachers[0].id,
        maxStudents: 25,
        isActive: true,
      },
      {
        title: "Database Management Systems",
        description:
          "Comprehensive introduction to database design, SQL, normalization, and database administration. Includes hands-on experience with MySQL and PostgreSQL.",
        courseCode: "CS301",
        credits: 3,
        semester: "Fall",
        year: 2024,
        teacherId: teachers[1].id,
        maxStudents: 20,
        isActive: true,
      },
      {
        title: "Web Development Fundamentals",
        description:
          "Learn to build modern web applications using HTML, CSS, JavaScript, and popular frameworks. Covers both frontend and backend development.",
        courseCode: "CS250",
        credits: 3,
        semester: "Spring",
        year: 2024,
        teacherId: teachers[1].id,
        maxStudents: 25,
        isActive: true,
      },
      {
        title: "Calculus I",
        description:
          "Introduction to differential and integral calculus. Topics include limits, derivatives, applications of derivatives, and basic integration techniques.",
        courseCode: "MATH101",
        credits: 4,
        semester: "Fall",
        year: 2024,
        teacherId: teachers[2].id,
        maxStudents: 35,
        isActive: true,
      },
      {
        title: "Statistics for Data Science",
        description:
          "Statistical methods and their applications in data analysis. Covers probability, hypothesis testing, regression analysis, and statistical software.",
        courseCode: "MATH201",
        credits: 3,
        semester: "Spring",
        year: 2024,
        teacherId: teachers[2].id,
        maxStudents: 30,
        isActive: true,
      },
      {
        title: "Physics I: Mechanics",
        description:
          "Classical mechanics including kinematics, dynamics, energy, momentum, and rotational motion. Laboratory component included.",
        courseCode: "PHYS101",
        credits: 4,
        semester: "Fall",
        year: 2024,
        teacherId: teachers[2].id,
        maxStudents: 20,
        isActive: true,
      },
    ])

    console.log("📚 Created sample courses")

    // Create sample enrollments
    const enrollments = []

    // Enroll students in various courses
    const enrollmentData = [
      // John Smith enrollments
      { studentId: students[0].id, courseId: courses[0].id, status: "enrolled" },
      { studentId: students[0].id, courseId: courses[4].id, status: "enrolled" },
      { studentId: students[0].id, courseId: courses[6].id, status: "enrolled" },

      // Emma Wilson enrollments
      { studentId: students[1].id, courseId: courses[0].id, status: "enrolled" },
      { studentId: students[1].id, courseId: courses[3].id, status: "enrolled" },
      { studentId: students[1].id, courseId: courses[5].id, status: "enrolled" },

      // David Brown enrollments
      { studentId: students[2].id, courseId: courses[1].id, status: "enrolled" },
      { studentId: students[2].id, courseId: courses[2].id, status: "enrolled" },
      { studentId: students[2].id, courseId: courses[4].id, status: "enrolled" },

      // Lisa Garcia enrollments
      { studentId: students[3].id, courseId: courses[0].id, status: "enrolled" },
      { studentId: students[3].id, courseId: courses[3].id, status: "enrolled" },
      { studentId: students[3].id, courseId: courses[5].id, status: "enrolled" },

      // Alex Thompson enrollments
      { studentId: students[4].id, courseId: courses[1].id, status: "enrolled" },
      { studentId: students[4].id, courseId: courses[2].id, status: "enrolled" },
      { studentId: students[4].id, courseId: courses[6].id, status: "enrolled" },

      // Maria Lopez enrollments
      { studentId: students[5].id, courseId: courses[0].id, status: "enrolled" },
      { studentId: students[5].id, courseId: courses[4].id, status: "enrolled" },
      { studentId: students[5].id, courseId: courses[5].id, status: "enrolled" },
    ]

    await Enrollment.bulkCreate(enrollmentData)

    console.log("📝 Created sample enrollments")

    console.log("✅ Database seeding completed successfully!")
    console.log("\n📋 Sample Accounts Created:")
    console.log("Admin: admin@college.edu / password123")
    console.log("Teacher: teacher@college.edu / password123")
    console.log("Student: student@college.edu / password123")
    console.log("\n🎓 Sample courses and enrollments have been created.")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    throw error
  }
}

// Run seeder if called directly
if (require.main === module) {
  const { sequelize } = require("../models")

  sequelize
    .authenticate()
    .then(() => {
      console.log("✅ Database connected")
      return sequelize.sync({ force: false })
    })
    .then(() => {
      console.log("✅ Database synchronized")
      return seedDatabase()
    })
    .then(() => {
      console.log("🎉 Seeding process completed")
      process.exit(0)
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error)
      process.exit(1)
    })
}

module.exports = seedDatabase
