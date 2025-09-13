"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { api } from "../services/api"
import toast from "react-hot-toast"

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      // Set token in axios headers
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      // Get user profile
      fetchUserProfile()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/auth/profile")
      setUser(response.data.user)
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
      // Clear invalid token
      localStorage.removeItem("token")
      delete api.defaults.headers.common["Authorization"]
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password })
      const { user, token } = response.data

      // Store token
      localStorage.setItem("token", token)
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      // Set user
      setUser(user)

      toast.success("Login successful!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed"
      toast.error(message)
      return { success: false, message }
    }
  }

  const signup = async (userData) => {
    try {
      const response = await api.post("/auth/signup", userData)
      const { user, token } = response.data

      // Store token
      localStorage.setItem("token", token)
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      // Set user
      setUser(user)

      toast.success("Account created successfully!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Signup failed"
      toast.error(message)
      return { success: false, message }
    }
  }

  const logout = () => {
    // Clear token and user data
    localStorage.removeItem("token")
    delete api.defaults.headers.common["Authorization"]
    setUser(null)
    toast.success("Logged out successfully!")
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put("/auth/profile", profileData)
      setUser(response.data.user)
      toast.success("Profile updated successfully!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Profile update failed"
      toast.error(message)
      return { success: false, message }
    }
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
