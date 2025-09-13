"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { courseAPI } from "../services/api"
import { BookOpen, Users, FileText, Plus, Calendar, Clock } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import CreateCourseModal from "../components/CreateCourseModal"
import toast from "react-hot-toast"

const TeacherDashboard = () => {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getCourses()
      // Filter courses taught by current user
      const teacherCourses = response.data.courses.filter((course) => course.teacherId === user?.id)
      setCourses(teacherCourses)
    } catch (error) {
      toast.error("Failed to fetch courses")
    } finally {
      setLoading(false)
    }
  }

  const handleCourseCreated = () => {
    setShowCreateModal(false)
    fetchCourses()
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, Professor {user?.name}!</h1>
          <p className="mt-2 text-gray-600">Manage your courses and track student progress.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Create Course
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">My Courses</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.reduce((total, course) => total + (course.students?.length || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Assignments</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Grades</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Courses */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses yet</h3>
            <p className="mt-1 text-sm text-gray-500">Create your first course to get started.</p>
            <button onClick={() => setShowCreateModal(true)} className="btn-primary mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
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

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>
                      {course.semester} {course.year}
                    </span>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>
                        {course.students?.length || 0}/{course.maxStudents}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="btn-outline flex-1 text-sm">View Details</button>
                    <button className="btn-primary flex-1 text-sm">Manage</button>
                  </div>
                </div>
              </div>
            ))}
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
              <p className="mt-1 text-sm text-gray-500">Course activities and student submissions will appear here.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <CreateCourseModal onClose={() => setShowCreateModal(false)} onCourseCreated={handleCourseCreated} />
      )}
    </div>
  )
}

export default TeacherDashboard
