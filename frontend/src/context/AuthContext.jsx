import React, { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh-token`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            signal: controller.signal,
          }
        )

        clearTimeout(timeoutId)

        if (response.status === 403 || response.status === 401) {
          // Token is invalid or expired
          localStorage.removeItem("accessToken")
          setUser(null)
          return
        }

        if (!response.ok) {
          throw new Error("Token refresh failed")
        }

        const data = await response.json()
        localStorage.setItem("accessToken", data.accessToken)
      } catch (error) {
        console.error("Auth Check Error:", error)
        localStorage.removeItem("accessToken")
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Login function with improved error handling
  const login = async (email, password) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Login failed")
      }

      const data = await response.json()

      localStorage.setItem("accessToken", data.accessToken)
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
      })
      return data.user
    } catch (error) {
      console.error("Login error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      })

      // More specific error messaging
      if (error.message.includes("Failed to fetch")) {
        throw new Error(
          "Unable to connect to server. Please check your network connection."
        )
      }

      throw error
    }
  }

  // Register function with improved error handling
  const register = async (name, email, password) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Registration failed")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Registration error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      })

      // More specific error messaging
      if (error.message.includes("Failed to fetch")) {
        throw new Error(
          "Unable to connect to server. Please check your network connection."
        )
      }

      throw error
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include", // Important for cookies
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Always clean up local storage and state, even if server request fails
      localStorage.removeItem("accessToken")
      setUser(null)
    }
  }

  // Create a function to get the auth header for API requests
  const getAuthHeader = () => {
    const token = localStorage.getItem("accessToken")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // Value to provide through the context
  const contextValue = {
    user,
    loading,
    login,
    logout,
    register,
    getAuthHeader,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
