/**
 * Utility functions for form validation
 */

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate URL format
export const isValidUrl = (url) => {
  if (!url || url.trim() === "") return true // Allow empty URLs
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

// Validate required field
export const isRequired = (value) => {
  if (typeof value === "string") {
    return value.trim() !== ""
  }
  return value !== null && value !== undefined
}

// Validate number field
export const isValidNumber = (value, options = {}) => {
  const { min, max, integer = false } = options

  if (value === "" || value === null || value === undefined) return true

  const num = Number(value)

  if (isNaN(num)) return false
  if (integer && !Number.isInteger(num)) return false
  if (min !== undefined && num < min) return false
  if (max !== undefined && num > max) return false

  return true
}

// Validate date
export const isValidDate = (dateStr) => {
  if (!dateStr) return false
  const date = new Date(dateStr)
  return !isNaN(date.getTime())
}

// Validate date range (end date is after start date)
export const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return true

  const start = new Date(startDate)
  const end = new Date(endDate)

  return end >= start
}

// Validate time range (end time is after start time on the same day)
export const isValidTimeRange = (startTime, endTime, startDate, endDate) => {
  if (!startTime || !endTime) return true

  // If dates are different, time comparison isn't needed
  if (startDate !== endDate) return true

  const [startHour, startMinute] = startTime.split(":").map(Number)
  const [endHour, endMinute] = endTime.split(":").map(Number)

  if (endHour > startHour) return true
  if (endHour === startHour && endMinute >= startMinute) return true

  return false
}

// Validate file type and size
export const isValidFile = (file, options = {}) => {
  const { maxSizeMB = 5, allowedTypes = [] } = options

  if (!file) return true

  // Check file size
  const fileSizeMB = file.size / (1024 * 1024)
  if (fileSizeMB > maxSizeMB) return false

  // Check file type if specified
  if (allowedTypes.length > 0) {
    const fileType = file.type
    return allowedTypes.includes(fileType)
  }

  return true
}

// Validate social media links
export const isValidSocialLink = (platform, url) => {
  if (!url || url.trim() === "") return true // Allow empty URLs

  try {
    const urlObj = new URL(url)

    switch (platform) {
      case "facebook":
        return urlObj.hostname.includes("facebook.com")
      case "twitter":
        return (
          urlObj.hostname.includes("twitter.com") ||
          urlObj.hostname.includes("x.com")
        )
      case "instagram":
        return urlObj.hostname.includes("instagram.com")
      case "linkedin":
        return urlObj.hostname.includes("linkedin.com")
      default:
        return true
    }
  } catch (e) {
    return false
  }
}

// Main validation function to use in forms
export const validateField = (fieldName, value, formData = {}) => {
  switch (fieldName) {
    case "eventName":
      if (!isRequired(value)) return "Event name is required"
      if (value.length < 3) return "Event name must be at least 3 characters"
      if (value.length > 100)
        return "Event name must be less than 100 characters"
      return ""

    case "eventDescription":
      if (!isRequired(value)) return "Event description is required"
      if (value.length < 50)
        return "Please provide a more detailed description (min 50 characters)"
      return ""

    case "eventCategory":
      if (!isRequired(value)) return "Event category is required"
      return ""

    case "eventBanner":
      if (!value) return "Event banner is required"
      if (
        !isValidFile(value, {
          maxSizeMB: 5,
          allowedTypes: ["image/jpeg", "image/png", "image/gif"],
        })
      ) {
        return "Please upload an image file (JPG, PNG, GIF) less than 5MB"
      }
      return ""

    case "startDate":
      if (!isRequired(value)) return "Start date is required"
      if (!isValidDate(value)) return "Please enter a valid date"

      // Check if date is in the future
      const startDate = new Date(value)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (startDate < today) return "Start date cannot be in the past"
      return ""

    case "endDate":
      if (!isRequired(value)) return "End date is required"
      if (!isValidDate(value)) return "Please enter a valid date"
      if (!isValidDateRange(formData.startDate, value)) {
        return "End date must be after start date"
      }
      return ""

    case "startTime":
      if (!isRequired(value)) return "Start time is required"
      return ""

    case "endTime":
      if (!isRequired(value)) return "End time is required"
      if (
        !isValidTimeRange(
          formData.startTime,
          value,
          formData.startDate,
          formData.endDate
        )
      ) {
        return "End time must be after start time"
      }
      return ""

    case "meetingLink":
      if (formData.eventType === "online" && !isRequired(value)) {
        return "Meeting link is required for online events"
      }
      if (value && !isValidUrl(value)) return "Please enter a valid URL"
      return ""

    case "venueName":
      if (formData.eventType === "offline" && !isRequired(value)) {
        return "Venue name is required for offline events"
      }
      return ""

    case "venueAddress":
      if (formData.eventType === "offline" && !isRequired(value)) {
        return "Venue address is required for offline events"
      }
      return ""

    case "mapLocation":
      if (
        formData.eventType === "offline" &&
        (!value || !value.lat || !value.lng)
      ) {
        return "Please select a location on the map"
      }
      return ""

    case "capacity":
      if (!isRequired(value)) return "Capacity is required"
      if (!isValidNumber(value, { min: 1, integer: true })) {
        return "Capacity must be a positive number"
      }
      return ""

    case "organizerName":
      if (!isRequired(value)) return "Organizer name is required"
      return ""

    case "organizerEmail":
      if (!isRequired(value)) return "Organizer email is required"
      if (!isValidEmail(value)) return "Please enter a valid email address"
      return ""

    case "organizerPhone":
      if (!isRequired(value)) return "Organizer phone is required"
      return ""

    case "organizerWebsite":
      if (value && !isValidUrl(value)) return "Please enter a valid URL"
      return ""

    case "ticketPrice":
      if (formData.isPaid && !isRequired(value))
        return "Ticket price is required for paid events"
      if (value && !isValidNumber(value, { min: 0.01 }))
        return "Ticket price must be a positive number"
      return ""

    case "ticketsAvailable":
      if (!isRequired(value)) return "Number of available tickets is required"
      if (!isValidNumber(value, { min: 1, integer: true })) {
        return "Number of tickets must be a positive whole number"
      }
      return ""

    case "earlyBirdDiscount.percentage":
      if (formData.earlyBirdDiscount?.enabled && !isRequired(value)) {
        return "Discount percentage is required"
      }
      if (value && !isValidNumber(value, { min: 1, max: 99 })) {
        return "Discount must be between 1% and 99%"
      }
      return ""

    case "earlyBirdDiscount.validUntil":
      if (formData.earlyBirdDiscount?.enabled && !isRequired(value)) {
        return "Discount valid until date is required"
      }
      if (value && !isValidDate(value)) return "Please enter a valid date"

      // Check if the date is after today but before the event start date
      if (value) {
        const discountDate = new Date(value)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const eventStart = formData.startDate
          ? new Date(formData.startDate)
          : null

        if (discountDate < today)
          return "Discount end date cannot be in the past"
        if (eventStart && discountDate > eventStart) {
          return "Discount must end before the event starts"
        }
      }
      return ""

    case "termsAccepted":
      if (!value) return "You must accept the terms and conditions"
      return ""

    default:
      return ""
  }
}
