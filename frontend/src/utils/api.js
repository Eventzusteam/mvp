/**
 * API utility functions for making requests to the backend
 */

// Base API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

/**
 * Generic fetch wrapper with error handling and authentication
 * @param {string} endpoint - API endpoint to call
 * @param {Object} options - Fetch options
 * @param {boolean} requiresAuth - Whether the request requires authentication
 * @returns {Promise<any>} - Response data
 */
export const fetchApi = async (endpoint, options = {}, requiresAuth = true) => {
  try {
    // Get access token from localStorage if authentication is required
    let headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    // Add CSRF token if available for non-GET requests
    if (options.method && options.method !== "GET") {
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content")
      if (csrfToken) {
        headers["X-CSRF-Token"] = csrfToken
      }
    }

    if (requiresAuth) {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        throw new Error("Authentication required")
      }
      headers["Authorization"] = `Bearer ${token}`
    }

    // Prepare the request options
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
          const { refreshAccessToken } = await import("./tokenManager.js")
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
 * Upload form data (including files) to the API
 * @param {string} endpoint - API endpoint
 * @param {FormData} formData - Form data to upload
 * @param {boolean} requiresAuth - Whether authentication is required
 * @returns {Promise<any>} - Response data
 */
export const uploadFormData = async (
  endpoint,
  formData,
  requiresAuth = true
) => {
  try {
    let headers = {}

    if (requiresAuth) {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        throw new Error("Authentication required")
      }
      headers["Authorization"] = `Bearer ${token}`
    }

    // Add CSRF token if available
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content")
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken
    }

    // Process formData to ensure complex objects are properly serialized
    // This helps when the backend expects JSON for nested objects
    const processedFormData = new FormData()

    // First, collect all keys to handle arrays properly
    const keys = new Set()
    for (let [key] of formData.entries()) {
      keys.add(key)
    }

    // Process each key (handles multiple values with same key properly)
    for (const key of keys) {
      const values = formData.getAll(key)

      // Special handling for arrays (multiple values with same key)
      if (values.length > 1) {
        // Check if these are files (for gallery images, etc.)
        const isFileArray = values.some(
          (v) => v instanceof File || v instanceof Blob
        )

        if (isFileArray) {
          // For file arrays, append each file individually with the same key
          values.forEach((value) => {
            processedFormData.append(key, value)
          })
        } else {
          // For non-file arrays, stringify as JSON array
          processedFormData.append(key, JSON.stringify(values))
        }
      } else {
        const value = values[0]
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
        } else if (
          value !== null &&
          typeof value === "object" &&
          !(value instanceof File) &&
          !(value instanceof Blob)
        ) {
          // For objects that aren't Files or Blobs, stringify them
          processedFormData.append(key, JSON.stringify(value))
        } else {
          // For primitive values and files, add as is
          processedFormData.append(key, value)
        }
      }
    }

    // Log formData contents for debugging (in development only)
    if (process.env.NODE_ENV !== "production") {
      // console.log("FormData being sent:")
      // for (let [key, value] of processedFormData.entries()) {
      //   console.log(
      //     `${key}: ${value instanceof File ? `File: ${value.name}` : value}`
      //   )
      // }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: processedFormData,
      credentials: "include", // Include cookies for CSRF protection
    })

    if (!response.ok) {
      // Try to parse error response as JSON
      const errorData = await response.json().catch(() => ({
        error: `HTTP error! status: ${response.status}`,
      }))

      // Enhanced error with status code and message
      const error = new Error(
        errorData.error || `Server returned ${response.status}`
      )
      error.status = response.status
      error.data = errorData
      throw error
    }

    return await response.json()
  } catch (error) {
    console.error("Form data upload failed:", error)
    throw error
  }
}

/**
 * Event API functions
 */
export const eventApi = {
  // Create a new event
  createEvent: async (eventFormData) => {
    return uploadFormData("/api/events/create", eventFormData)
  },

  // Get all events (with pagination)
  getEvents: async (page = 1, limit = 10) => {
    return fetchApi(`/api/events?page=${page}&limit=${limit}`)
  },

  // Get public events (with pagination)
  getPublicEvents: async (page = 1, limit = 10) => {
    return fetchApi(
      `/api/events/get-public-events?page=${page}&limit=${limit}`,
      {},
      false
    )
  },

  // Get a single event by ID (Publicly accessible)
  getEventById: async (eventId) => {
    // Use the public endpoint for fetching details, no auth required initially
    return fetchApi(`/api/events/public/${eventId}`, {}, false)
  },

  // Update an event
  updateEvent: async (eventId, eventData) => {
    return fetchApi(`/api/events/${eventId}`, {
      method: "PUT",
      body: JSON.stringify(eventData),
    })
  },

  // Delete an event
  deleteEvent: async (eventId) => {
    return fetchApi(`/api/events/${eventId}`, {
      method: "DELETE",
    })
  },
}

/**
 * Authentication API functions
 */
export const authApi = {
  // Login user
  login: async (credentials) => {
    return fetchApi(
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
    return fetchApi(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify(userData),
      },
      false
    )
  },

  // Get current user
  getCurrentUser: async () => {
    return fetchApi("/api/auth/me")
  },

  // Logout user
  logout: async () => {
    return fetchApi("/api/auth/logout", {
      method: "POST",
    })
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    return fetchApi(
      "/api/auth/forgot-password",
      {
        method: "POST",
        body: JSON.stringify({ email }),
      },
      false
    )
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    return fetchApi(
      "/api/auth/reset-password",
      {
        method: "POST",
        body: JSON.stringify({ token, newPassword }),
      },
      false
    )
  },
}

/**
 * Contact API functions
 */
export const contactApi = {
  // Send contact form
  sendContactForm: async (contactData) => {
    return fetchApi(
      "/api/contact",
      {
        method: "POST",
        body: JSON.stringify(contactData),
      },
      false
    )
  },
}
