-- College LMS Database Schema
-- This file contains the SQL schema for the College Learning Management System

-- Create database (run this first)
CREATE DATABASE IF NOT EXISTS college_lms;
USE college_lms;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin') DEFAULT 'student',
    studentId VARCHAR(50) UNIQUE NULL,
    phone VARCHAR(20) NULL,
    avatar VARCHAR(255) NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NULL,
    courseCode VARCHAR(20) UNIQUE NOT NULL,
    credits INT DEFAULT 3 CHECK (credits >= 1 AND credits <= 6),
    semester ENUM('Fall', 'Spring', 'Summer') NOT NULL,
    year INT NOT NULL CHECK (year >= 2020 AND year <= 2030),
    teacherId INT NOT NULL,
    maxStudents INT DEFAULT 30,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacherId) REFERENCES users(id) ON DELETE CASCADE
);

-- Enrollments table (junction table for many-to-many relationship)
CREATE TABLE IF NOT EXISTS enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studentId INT NOT NULL,
    courseId INT NOT NULL,
    enrollmentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grade VARCHAR(5) NULL CHECK (grade IN ('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F', 'I', 'W')),
    status ENUM('enrolled', 'completed', 'dropped') DEFAULT 'enrolled',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (studentId, courseId)
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NULL,
    courseId INT NOT NULL,
    dueDate DATETIME NOT NULL,
    maxPoints INT DEFAULT 100 CHECK (maxPoints >= 1),
    type ENUM('homework', 'quiz', 'exam', 'project') DEFAULT 'homework',
    attachments JSON NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignmentId INT NOT NULL,
    studentId INT NOT NULL,
    content TEXT NULL,
    attachments JSON NULL,
    submittedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grade INT NULL CHECK (grade >= 0),
    feedback TEXT NULL,
    status ENUM('submitted', 'graded', 'late') DEFAULT 'submitted',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assignmentId) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_submission (assignmentId, studentId)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_courses_teacher ON courses(teacherId);
CREATE INDEX idx_courses_semester_year ON courses(semester, year);
CREATE INDEX idx_enrollments_student ON enrollments(studentId);
CREATE INDEX idx_enrollments_course ON enrollments(courseId);
CREATE INDEX idx_assignments_course ON assignments(courseId);
CREATE INDEX idx_assignments_due_date ON assignments(dueDate);
CREATE INDEX idx_submissions_assignment ON submissions(assignmentId);
CREATE INDEX idx_submissions_student ON submissions(studentId);
