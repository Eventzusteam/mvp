/**
 * Token Manager - Handles refresh token logic and authentication state
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

// Get stored tokens
export const getAccessToken = () => localStorage.getItem("accessToken")

// Store tokens securely
export const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem("accessToken", token)
  }
}

// Clear tokens on logout
export const clearTokens = () => {
  localStorage.removeItem("accessToken")
}

// Refresh the access token using the HTTP-only refresh token cookie
export const refreshAccessToken = async () => {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout

    const response = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
      method: "POST",
      credentials: "include", // Important for cookies
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": getCsrfToken(), // Add CSRF protection (lowercase 'x')
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to refresh token")
    }

    const data = await response.json()
    setAccessToken(data.accessToken)
    return data.accessToken
  } catch (error) {
    console.error("Token refresh failed:", error)
    clearTokens()
    return null
  }
}

// Get CSRF token from meta tag
export const getCsrfToken = () => {
  const metaTag = document.querySelector('meta[name="csrf-token"]')
  return metaTag ? metaTag.getAttribute("content") : ""
}

// Setup automatic token refresh
export const setupTokenRefresh = (callback) => {
  // Refresh token 1 minute before expiration (assuming 15 min token life)
  const refreshInterval = setInterval(async () => {
    const token = await refreshAccessToken()
    if (token && callback) {
      callback(token)
    } else if (!token) {
      clearInterval(refreshInterval)
    }
  }, 14 * 60 * 1000) // 14 minutes

  return () => clearInterval(refreshInterval)
}

// Handle API requests with token management
export const authenticatedFetch = async (url, options = {}) => {
  // Get current access token
  let token = getAccessToken()

  // Prepare headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  // Add token if available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  // Add CSRF token for non-GET requests
  if (options.method && options.method !== "GET") {
    headers["x-csrf-token"] = getCsrfToken() // Use lowercase 'x'
  }

  // Make the request
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    })

    // Handle token expiration
    if (response.status === 401) {
      // Try to refresh the token
      const newToken = await refreshAccessToken()

      // If refresh successful, retry the request
      if (newToken) {
        headers["Authorization"] = `Bearer ${newToken}`
        return fetch(url, {
          ...options,
          headers,
          credentials: "include",
        })
      }
    }

    return response
  } catch (error) {
    console.error("Request failed:", error)
    throw error
  }
}
