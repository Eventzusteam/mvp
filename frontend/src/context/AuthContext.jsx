import React, { createContext, useState, useEffect } from "react"

// Create the context
export const AuthContext = createContext()

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Try to refresh the token
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh-token`,
          {
            method: "POST",
            credentials: "include", // Important for cookies
          }
        )

        if (!response.ok) {
          // If refresh token request fails, clear auth state
          throw new Error("Token refresh failed")
        }

        const data = await response.json()
        // Store the new access token
        localStorage.setItem("accessToken", data.accessToken)

        // Get user data with proper error handling
        try {
          const userResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/api/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${data.accessToken}`,
              },
            }
          )

          if (!userResponse.ok) {
            throw new Error("Failed to fetch user data")
          }

          const userData = await userResponse.json()
          setUser(userData)
        } catch (userError) {
          console.error("User fetch failed:", userError)
          localStorage.removeItem("accessToken")
          setUser(null)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        // Clear any stored data if auth check fails
        localStorage.removeItem("accessToken")
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include", // Important for cookies
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Login failed")
      }

      const data = await response.json()

      // Store token and user data
      localStorage.setItem("accessToken", data.accessToken)
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
      })
      return data.user
    } catch (error) {
      console.error("Login error:", error)
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

  // Register function
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
      console.error("Registration error:", error)
      throw error
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
