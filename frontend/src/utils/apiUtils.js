/**
 * Enhanced API Utilities for Event Management Application
 *
 * This file provides improved utilities for handling API requests,
 * with better error handling, data serialization, and token management.
 */

import { refreshAccessToken, getAccessToken } from "./tokenManager"

// Base API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

/**
 * Get CSRF token from meta tag
 * @returns {string} CSRF token
 */
const getCsrfToken = () => {
  const metaTag = document.querySelector('meta[name="csrf-token"]')
  return metaTag ? metaTag.getAttribute("content") : ""
}

/**
 * Serialize complex data for API requests
 * @param {Object} data - Data to serialize
 * @returns {Object} Serialized data
 */
export const serializeData = (data) => {
  if (!data) return data

  const serialized = {}

  Object.entries(data).forEach(([key, value]) => {
    // Skip null or undefined values
    if (value === null || value === undefined) return

    // Handle arrays (including arrays of objects)
    if (Array.isArray(value)) {
      serialized[key] = value.map((item) => {
        if (item === null || item === undefined) return item
        return typeof item === "object" ? JSON.stringify(item) : item
      })
    }
    // Handle objects (but not Files or Blobs)
    else if (
      typeof value === "object" &&
      !(value instanceof File) &&
      !(value instanceof Blob)
    ) {
      serialized[key] = JSON.stringify(value)
    }
    // Handle primitive values and files
    else {
      serialized[key] = value
    }
  })

  return serialized
}

/**
 * Process FormData to ensure complex objects are properly serialized
 * @param {FormData} formData - Original FormData
 * @returns {FormData} Processed FormData
 */
export const processFormData = (formData) => {
  const processedFormData = new FormData()

  // Copy all entries from the original formData with proper serialization
  for (let [key, value] of formData.entries()) {
    // Skip null or undefined values
    if (value === null || value === undefined) continue

    // If value is a string that looks like an object/array but wasn't properly stringified
    if (
      typeof value === "string" &&
      ((value.startsWith("{") && value.endsWith("}")) ||
        (value.startsWith("[") && value.endsWith("]")))
    ) {
      try {
        // Check if it's already valid JSON
        JSON.parse(value)
        processedFormData.append(key, value)
      } catch (e) {
        // If not valid JSON, stringify it properly
        processedFormData.append(key, JSON.stringify(value))
      }
    }
    // For objects that aren't Files or Blobs, stringify them
    else if (
      value !== null &&
      typeof value === "object" &&
      !(value instanceof File) &&
      !(value instanceof Blob)
    ) {
      processedFormData.append(key, JSON.stringify(value))
    }
    // For primitive values and files, add as is
    else {
      processedFormData.append(key, value)
    }
  }

  return processedFormData
}

/**
 * Enhanced fetch API with error handling, authentication, and token refresh
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @param {boolean} requiresAuth - Whether authentication is required
 * @returns {Promise<any>} Response data
 */
export const fetchWithAuth = async (
  endpoint,
  options = {},
  requiresAuth = true
) => {
  try {
    // Prepare headers
    let headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    // Add CSRF token for non-GET requests
    if (options.method && options.method !== "GET") {
      const csrfToken = getCsrfToken()
      if (csrfToken) {
        headers["X-CSRF-Token"] = csrfToken
      }
    }

    // Add authentication token if required
    if (requiresAuth) {
      const token = getAccessToken()
      if (!token) {
        throw new Error("Authentication required")
      }
      headers["Authorization"] = `Bearer ${token}`
    }

    // Prepare request options
    const fetchOptions = {
      ...options,
      headers,
      credentials: "include", // Include cookies for CSRF protection
    }

    // Make the request
    let response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions)

    // Handle token expiration (401 Unauthorized)
    if (response.status === 401 && requiresAuth) {
      const errorData = await response.json().catch(() => ({}))

      // Check if token expired
      if (errorData.code === "TOKEN_EXPIRED") {
        try {
          // Try to refresh the token
          const newToken = await refreshAccessToken()

          if (newToken) {
            // Update Authorization header with new token
            headers["Authorization"] = `Bearer ${newToken}`

            // Retry the request with new token
            const retryOptions = {
              ...options,
              headers,
              credentials: "include",
            }

            response = await fetch(`${API_BASE_URL}${endpoint}`, retryOptions)
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError)
          throw new Error("Session expired. Please login again.")
        }
      }
    }

    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `HTTP error! status: ${response.status}`,
      }))

      // Enhanced error with status code and message
      const error = new Error(
        errorData.error || `Server returned ${response.status}`
      )
      error.status = response.status
      error.code = errorData.code
      error.data = errorData
      throw error
    }

    // Parse and return the response data
    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

/**
 * Upload form data (including files) to the API with improved handling
 * @param {string} endpoint - API endpoint
 * @param {FormData|Object} data - Form data or object to upload
 * @param {boolean} requiresAuth - Whether authentication is required
 * @returns {Promise<any>} Response data
 */
export const uploadData = async (endpoint, data, requiresAuth = true) => {
  try {
    // Prepare headers
    let headers = {}

    // Add authentication if required
    if (requiresAuth) {
      const token = getAccessToken()
      if (!token) {
        throw new Error("Authentication required")
      }
      headers["Authorization"] = `Bearer ${token}`
    }

    // Add CSRF token
    const csrfToken = getCsrfToken()
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken
    }

    // Process data based on type
    let processedData
    let contentTypeHeader = {}

    if (data instanceof FormData) {
      // For FormData, process it to handle complex objects
      processedData = processFormData(data)
      // Don't set Content-Type for FormData (browser will set with boundary)
    } else {
      // For regular objects, convert to FormData
      processedData = new FormData()
      const serialized = serializeData(data)

      // Add each property to FormData
      Object.entries(serialized).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          processedData.append(key, value)
        }
      })
    }

    // Make the request
    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        ...headers,
        ...contentTypeHeader,
      },
      body: processedData,
      credentials: "include",
    })

    // Handle token expiration
    if (response.status === 401 && requiresAuth) {
      try {
        // Try to refresh the token
        const newToken = await refreshAccessToken()

        if (newToken) {
          // Update Authorization header with new token
          headers["Authorization"] = `Bearer ${newToken}`

          // Retry the request
          response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: {
              ...headers,
              ...contentTypeHeader,
            },
            body: processedData,
            credentials: "include",
          })
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError)
        throw new Error("Session expired. Please login again.")
      }
    }

    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `HTTP error! status: ${response.status}`,
      }))

      const error = new Error(
        errorData.error || `Server returned ${response.status}`
      )
      error.status = response.status
      error.data = errorData
      throw error
    }

    return await response.json()
  } catch (error) {
    console.error("Upload failed:", error)
    throw error
  }
}

/**
 * Event API utilities
 */
export const eventApi = {
  // Create a new event
  createEvent: async (eventData) => {
    return uploadData("/api/events/create", eventData)
  },

  // Get all events (with pagination)
  getEvents: async (page = 1, limit = 10, filters = {}) => {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters,
    }).toString()

    return fetchWithAuth(`/api/events?${queryParams}`, { method: "GET" }, false)
  },

  // Get a single event by ID
  getEventById: async (eventId) => {
    return fetchWithAuth(`/api/events/${eventId}`, { method: "GET" }, false)
  },

  // Update an event
  updateEvent: async (eventId, eventData) => {
    return uploadData(`/api/events/${eventId}`, eventData)
  },

  // Delete an event
  deleteEvent: async (eventId) => {
    return fetchWithAuth(`/api/events/${eventId}`, { method: "DELETE" })
  },

  // Register for an event
  registerForEvent: async (eventId, registrationData) => {
    return uploadData(`/api/events/${eventId}/register`, registrationData)
  },
}

/**
 * User API utilities
 */
export const userApi = {
  // Get user profile
  getProfile: async () => {
    return fetchWithAuth("/api/users/profile", { method: "GET" })
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return uploadData("/api/users/profile", profileData)
  },

  // Get user's events
  getUserEvents: async () => {
    return fetchWithAuth("/api/users/events", { method: "GET" })
  },
}

/**
 * Auth API utilities
 */
export const authApi = {
  // Login user
  login: async (credentials) => {
    return fetchWithAuth(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify(credentials),
      },
      false
    )
  },

  // Register user
  register: async (userData) => {
    return fetchWithAuth(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify(userData),
      },
      false
    )
  },

  // Logout user
  logout: async () => {
    return fetchWithAuth("/api/auth/logout", { method: "POST" })
  },

  // Refresh token
  refreshToken: async () => {
    return fetchWithAuth("/api/auth/refresh-token", { method: "POST" }, false)
  },
}
