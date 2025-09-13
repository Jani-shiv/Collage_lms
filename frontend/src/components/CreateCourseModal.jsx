"use client"

import { useState } from "react"
import { courseAPI } from "../services/api"
import { X } from "lucide-react"
import LoadingSpinner from "./LoadingSpinner"
import toast from "react-hot-toast"

const CreateCourseModal = ({ onClose, onCourseCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseCode: "",
    credits: 3,
    semester: "Fall",
    year: new Date().getFullYear(),
    maxStudents: 30,
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "number" ? Number.parseInt(value) : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await courseAPI.createCourse(formData)
      toast.success("Course created successfully!")
      onCourseCreated()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create course")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Create New Course</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Title</label>
            <input
              type="text"
              name="title"
              required
              className="input mt-1"
              placeholder="e.g., Introduction to Computer Science"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Course Code</label>
            <input
              type="text"
              name="courseCode"
              required
              className="input mt-1"
              placeholder="e.g., CS101"
              value={formData.courseCode}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              rows={3}
              className="input mt-1"
              placeholder="Course description..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Credits</label>
              <input
                type="number"
                name="credits"
                min="1"
                max="6"
                required
                className="input mt-1"
                value={formData.credits}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Max Students</label>
              <input
                type="number"
                name="maxStudents"
                min="1"
                required
                className="input mt-1"
                value={formData.maxStudents}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Semester</label>
              <select name="semester" className="input mt-1" value={formData.semester} onChange={handleChange}>
                <option value="Fall">Fall</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <input
                type="number"
                name="year"
                min="2020"
                max="2030"
                required
                className="input mt-1"
                value={formData.year}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center">
              {loading ? <LoadingSpinner size="sm" /> : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCourseModal
