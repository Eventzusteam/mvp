/**
 * Utility functions to help with form operations
 */

// Format date for input fields (YYYY-MM-DD)
export const formatDateForInput = (date) => {
  if (!date) return ""

  // Handle both Date objects and string dates
  const dateObj = typeof date === "string" ? new Date(date) : date

  if (isNaN(dateObj.getTime())) return ""

  return dateObj.toISOString().split("T")[0]
}

// Format date for display (e.g., "Monday, January 1, 2025")
export const formatDateForDisplay = (dateString) => {
  if (!dateString) return ""

  const date = new Date(dateString)

  if (isNaN(date.getTime())) return ""

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Format time for display (e.g., "7:30 PM")
export const formatTimeForDisplay = (timeString) => {
  if (!timeString) return ""

  const [hours, minutes] = timeString.split(":").map(Number)

  const period = hours >= 12 ? "PM" : "AM"
  const displayHours = hours % 12 || 12 // Convert 0 to 12 for 12 AM

  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
}

// Convert file size to human-readable format
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes"

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))

  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
}

// Generate a list of timezone options
export const getTimezoneOptions = () => {
  return [
    { value: "UTC", label: "UTC" },
    { value: "GMT", label: "GMT (Greenwich Mean Time)" },
    { value: "EST", label: "EST (Eastern Standard Time)" },
    { value: "CST", label: "CST (Central Standard Time)" },
    { value: "MST", label: "MST (Mountain Standard Time)" },
    { value: "PST", label: "PST (Pacific Standard Time)" },
    { value: "America/New_York", label: "New York" },
    { value: "America/Chicago", label: "Chicago" },
    { value: "America/Denver", label: "Denver" },
    { value: "America/Los_Angeles", label: "Los Angeles" },
    { value: "Europe/London", label: "London" },
    { value: "Europe/Paris", label: "Paris" },
    { value: "Europe/Berlin", label: "Berlin" },
    { value: "Asia/Tokyo", label: "Tokyo" },
    { value: "Asia/Shanghai", label: "Shanghai" },
    { value: "Asia/Singapore", label: "Singapore" },
    { value: "Australia/Sydney", label: "Sydney" },
    { value: "Pacific/Auckland", label: "Auckland" },
  ]
}

// Generate a list of event category options
export const getEventCategoryOptions = () => {
  return [
    { value: "conference", label: "Conference" },
    { value: "seminar", label: "Seminar" },
    { value: "workshop", label: "Workshop" },
    { value: "concert", label: "Concert" },
    { value: "expo", label: "Exhibition/Expo" },
    { value: "networking", label: "Networking" },
    { value: "party", label: "Party/Social Gathering" },
    { value: "sports", label: "Sports/Recreation" },
    { value: "fundraiser", label: "Fundraiser/Charity" },
    { value: "education", label: "Educational" },
    { value: "corporate", label: "Corporate" },
    { value: "festival", label: "Festival" },
    { value: "performance", label: "Performance/Show" },
    { value: "other", label: "Other" },
  ]
}

// Generate time slot options (30 min intervals)
export const getTimeOptions = () => {
  const options = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, "0")
      const formattedMinute = minute.toString().padStart(2, "0")
      const value = `${formattedHour}:${formattedMinute}`

      const period = hour >= 12 ? "PM" : "AM"
      const displayHour = hour % 12 || 12 // Convert 0 to 12 for 12 AM
      const label = `${displayHour}:${formattedMinute} ${period}`

      options.push({ value, label })
    }
  }
  return options
}

// Format address for display
export const formatAddress = (address) => {
  if (!address) return ""

  // Remove any extra spaces and line breaks
  return address.replace(/\s+/g, " ").trim()
}

// Create rich text editor initial content
export const createEditorInitialContent = () => {
  return `
    <p>Describe your event here. You can provide information about:</p>
    <ul>
      <li>What attendees can expect</li>
      <li>Special guests or speakers</li>
      <li>Agenda or schedule</li>
      <li>Any requirements for participation</li>
    </ul>
  `
}

// Sanitize and prepare form data for submission
export const prepareFormDataForSubmission = (formData) => {
  const preparedData = { ...formData }

  // Convert capacity and ticket values to numbers
  if (preparedData.capacity) {
    preparedData.capacity = parseInt(preparedData.capacity, 10)
  }

  if (preparedData.ticketsAvailable) {
    preparedData.ticketsAvailable = parseInt(preparedData.ticketsAvailable, 10)
  }

  if (preparedData.isPaid && preparedData.ticketPrice) {
    preparedData.ticketPrice = parseFloat(preparedData.ticketPrice)
  }

  // Format dates for API
  if (preparedData.startDate) {
    preparedData.startDateFormatted = formatDateForDisplay(
      preparedData.startDate
    )
  }

  if (preparedData.endDate) {
    preparedData.endDateFormatted = formatDateForDisplay(preparedData.endDate)
  }

  // Handle early bird discount
  if (
    preparedData.earlyBirdDiscount &&
    preparedData.earlyBirdDiscount.enabled
  ) {
    preparedData.earlyBirdDiscount.percentage = parseFloat(
      preparedData.earlyBirdDiscount.percentage
    )
  } else {
    // If early bird is disabled, clean up the data
    preparedData.earlyBirdDiscount = {
      enabled: false,
      percentage: null,
      validUntil: null,
    }
  }

  // Clean up empty social links
  Object.keys(preparedData.socialLinks).forEach((platform) => {
    if (!preparedData.socialLinks[platform]) {
      preparedData.socialLinks[platform] = null
    }
  })

  return preparedData
}

// Check if a form step is complete
export const isStepComplete = (step, formData, errors) => {
  if (Object.keys(errors).length > 0) return false

  switch (step) {
    case 1: // Basic Details
      return !!(
        formData.eventName &&
        formData.eventDescription &&
        formData.eventCategory &&
        formData.eventBanner
      )

    case 2: // Date & Time
      return !!(
        formData.startDate &&
        formData.endDate &&
        formData.startTime &&
        formData.endTime
      )

    case 3: // Location Details
      if (formData.eventType === "online") {
        return !!(formData.meetingLink && formData.capacity)
      } else {
        return !!(
          formData.venueName &&
          formData.venueAddress &&
          formData.mapLocation?.lat &&
          formData.mapLocation?.lng &&
          formData.capacity
        )
      }

    case 4: // Organizer Details
      return !!(
        formData.organizerName &&
        formData.organizerEmail &&
        formData.organizerPhone
      )

    case 5: // Ticket Details
      if (formData.isPaid) {
        return !!(formData.ticketPrice && formData.ticketsAvailable)
      } else {
        return !!formData.ticketsAvailable
      }

    case 6: // Additional Details
      return formData.termsAccepted === true

    default:
      return false
  }
}
