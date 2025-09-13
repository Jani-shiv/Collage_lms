"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { courseAPI } from "../services/api"
import { BookOpen, Calendar, Clock, Users, Plus } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import toast from "react-hot-toast"

const StudentDashboard = () => {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getCourses()
      setCourses(response.data.courses)
    } catch (error) {
      toast.error("Failed to fetch courses")
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (courseId) => {
    setEnrolling(courseId)
    try {
      await courseAPI.enrollInCourse(courseId)
      toast.success("Successfully enrolled in course!")
      fetchCourses() // Refresh courses
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to enroll in course")
    } finally {
      setEnrolling(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="mt-2 text-gray-600">Here's what's happening in your courses today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter((course) => course.students?.some((student) => student.id === user?.id)).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Assignments Due</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Hours Studied</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Courses */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Courses</h2>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses available</h3>
            <p className="mt-1 text-sm text-gray-500">Check back later for new courses.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const isEnrolled = course.students?.some((student) => student.id === user?.id)

              return (
                <div key={course.id} className="card hover:shadow-md transition-shadow">
                  <div className="card-header">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-500">{course.courseCode}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {course.credits} Credits
                      </span>
                    </div>
                  </div>

                  <div className="card-content">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {course.description || "No description available."}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Users className="h-4 w-4 mr-1" />
                      <span>Instructor: {course.teacher?.name}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>
                        {course.semester} {course.year}
                      </span>
                      <span>
                        {course.students?.length || 0}/{course.maxStudents} students
                      </span>
                    </div>

                    {isEnrolled ? (
                      <div className="flex items-center text-green-600">
                        <div className="h-2 w-2 bg-green-600 rounded-full mr-2"></div>
                        <span className="text-sm font-medium">Enrolled</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course.id)}
                        disabled={enrolling === course.id}
                        className="btn-primary w-full flex items-center justify-center"
                      >
                        {enrolling === course.id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-1" />
                            Enroll
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="card">
          <div className="card-content">
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
              <p className="mt-1 text-sm text-gray-500">Your course activities will appear here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
