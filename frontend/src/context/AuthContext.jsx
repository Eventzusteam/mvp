import React, { useState, useEffect, useCallback } from "react"
import { getCsrfToken } from "../utils/tokenManager" // Import getCsrfToken
import { AuthContext } from "./AuthContextDefinition" // Import context definition
import { toast } from "react-toastify" // Import toast

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  // Remove csrfToken state, rely on getCsrfToken utility
  // const [csrfToken, setCsrfToken] = useState(null)

  // Function to refresh the token
  // Accepts csrfToken as an argument to avoid race conditions during init
  const refreshToken = useCallback(
    async (csrfTokenOverride = null) => {
      // Use the override if provided (during init), otherwise get from meta tag
      const currentCsrfToken = csrfTokenOverride || getCsrfToken()
      if (!currentCsrfToken) {
        // console.error(
        //   "[AuthContext] CSRF token not available for refresh request."
        // )
        toast.error("Security token unavailable. Please refresh the page.")
        return false // Fail if token isn't ready
      }

      // console.log(
      //   "[AuthContext] Attempting token refresh with CSRF token:",
      //   currentCsrfToken
      // )
      // toast.info("Refreshing session..."); // Optional: Can be noisy

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
              "x-csrf-token": currentCsrfToken, // Use token fetched by utility
            },
            signal: controller.signal,
          }
        )

        clearTimeout(timeoutId)

        if (response.status === 403 || response.status === 401) {
          // Token is invalid or expired
          localStorage.removeItem("accessToken")
          setUser(null)
          toast.warn("Session expired. Please log in again.")
          return false
        }

        if (!response.ok) {
          throw new Error("Token refresh failed")
        }

        const data = await response.json()
        localStorage.setItem("accessToken", data.accessToken)

        // If we don't have user data yet but we have a userId, fetch the user data
        if (!user && data.userId) {
          await fetchUserData(data.accessToken)
        }

        return true
      } catch (error) {
        // console.error("Token Refresh Error:", error)
        toast.error(error)
        localStorage.removeItem("accessToken")
        setUser(null)
        return false
      }
    },
    [user]
  ) // Keep user dependency, csrfToken is now passed or fetched

  // Function to fetch user data
  const fetchUserData = async (token) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) throw new Error("Failed to fetch user data")

      const userData = await response.json()
      setUser(userData)
    } catch (error) {
      // console.error("Fetch user data error:", error)
      toast.error(error)
    }
  }

  // Function to fetch CSRF token and store in meta tag
  const fetchCsrf = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/csrf-token`,
        {
          method: "GET",
          credentials: "include",
        }
      )
      if (!response.ok) throw new Error("Failed to fetch CSRF token")
      const data = await response.json()
      // setCsrfToken(data.csrfToken) // No longer needed to set state

      // Store in a meta tag for api.js/tokenManager.js to access easily
      let meta = document.querySelector('meta[name="csrf-token"]')
      if (!meta) {
        meta = document.createElement("meta")
        meta.name = "csrf-token"
        document.head.appendChild(meta)
      }
      meta.content = data.csrfToken
      // Return the fetched token directly
      return data.csrfToken
    } catch (error) {
      // console.error("Failed to fetch CSRF token:", error)
      toast.error(error)
      // Return null or false to indicate failure
      return null
    }
  }

  // Check if user is logged in on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true)
      // Fetch CSRF token FIRST and get the token value
      const fetchedCsrfToken = await fetchCsrf()

      if (fetchedCsrfToken) {
        // If CSRF fetch was successful, proceed with auth check using the fetched token
        try {
          // console.log(
          //   "[AuthContext] Initializing auth: Attempting initial token refresh with fetched CSRF token..."
          // )
          // Pass the fetched token directly to refreshToken
          const success = await refreshToken(fetchedCsrfToken)
          if (!success) {
            // console.log(
            //   "[AuthContext] Initial token refresh failed or no token found."
            // )
            // No toast here, handled within refreshToken or login needed
            setUser(null)
          } else {
            // console.log("[AuthContext] Initial token refresh successful.")
            // No toast needed for successful background refresh
          }
        } catch (error) {
          // console.error(
          //   "[AuthContext] Auth Check Error during initialization:",
          //   error
          // )
          toast.error(error)
          localStorage.removeItem("accessToken")
          setUser(null)
        }
      } else {
        // Handle CSRF fetch failure
        // console.error(
        //   "[AuthContext] Could not initialize auth: CSRF token fetch failed."
        // )
        // Error already toasted in fetchCsrf
        setUser(null) // Ensure user is logged out if CSRF fails
      }
      setLoading(false)
    }

    initializeAuth()

    // Set up token refresh interval (starts after initial check)
    const refreshInterval = setInterval(() => {
      // ADD LOGGING HERE
      // console.log(
      //   "[AuthContext] Interval: Attempting scheduled token refresh..."
      // )
      // Interval refresh will use getCsrfToken() as the meta tag should be stable by then
      refreshToken()
    }, 14 * 60 * 1000) // Refresh token every 14 minutes

    return () => clearInterval(refreshInterval)
  }, [refreshToken]) // refreshToken dependency is okay here

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
      toast.success(`Welcome back, ${data.user.name}!`)
      return data.user
    } catch (error) {
      // console.error("Login error details:", {
      //   message: error.message,
      //   name: error.name,
      //   stack: error.stack,
      // })

      // More specific error messaging
      if (error.message.includes("Failed to fetch")) {
        toast.error(
          "Unable to connect to server. Please check your network connection."
        )
        throw new Error(
          "Unable to connect to server. Please check your network connection."
        )
      }
      toast.error(
        error.message || "Login failed. Please check your credentials."
      )
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
      toast.success("Registration successful! Please log in.")
      return data
    } catch (error) {
      // console.error("Registration error details:", {
      //   message: error.message,
      //   name: error.name,
      //   stack: error.stack,
      // })

      // More specific error messaging
      if (error.message.includes("Failed to fetch")) {
        toast.error(
          "Unable to connect to server. Please check your network connection."
        )
        throw new Error(
          "Unable to connect to server. Please check your network connection."
        )
      }
      toast.error(error.message || "Registration failed. Please try again.")
      throw error
    }
  }

  // Logout function
  const logout = async () => {
    const csrfToken = getCsrfToken() // Get the CSRF token
    if (!csrfToken) {
      // console.error("[AuthContext] Logout failed: CSRF token not found.")
      toast.error("Logout failed: Security token missing.")
      // Optionally, still attempt local cleanup even if CSRF is missing
      localStorage.removeItem("accessToken")
      setUser(null)
      return // Prevent the fetch call without a token
    }

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include", // Important for cookies
        headers: {
          // Add the CSRF token header
          "x-csrf-token": csrfToken,
        },
      })
    } catch (error) {
      // console.error("Logout error:", error)
      toast.error(
        "Logout failed on the server, but you have been logged out locally."
      )
    } finally {
      // Always clean up local storage and state, even if server request fails
      localStorage.removeItem("accessToken")
      setUser(null)
      toast.info("You have been logged out.")
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
    isAuthenticated: !!user, // Derive isAuthenticated from user state
    login,
    register,
    logout,
    refreshToken, // Keep providing refreshToken if needed elsewhere
    fetchUserData, // Keep providing fetchUserData if needed elsewhere
    getAuthHeader, // Add getAuthHeader to the context value
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
