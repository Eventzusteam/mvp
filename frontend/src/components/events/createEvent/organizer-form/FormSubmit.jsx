import React, { useState } from "react"
import { motion } from "framer-motion"
import { Check, AlertCircle, RefreshCw, Send, Image } from "lucide-react"
import { useContext } from "react"
import { AuthContext } from "../../../../context/AuthContextDefinition.js"

const FormSubmit = ({ formData, bannerImage }) => {
  const [submissionState, setSubmissionState] = useState("initial") // initial, submitting, success, error
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const { user, getAuthHeader } = useContext(AuthContext)

  const validateForm = () => {
    // Validate terms agreement
    if (!agreedToTerms) {
      return {
        valid: false,
        message:
          "You must agree to the terms and conditions to submit your event",
      }
    }

    // Before preparing jsonData
    if (formData.ticketTypes && formData.ticketTypes.length > 0) {
      // Filter out ticket types with missing price or quantity
      const validTickets = formData.ticketTypes.filter(
        (ticket) => ticket.price !== "" && ticket.quantity !== ""
      )

      // Only include ticket types if there are valid ones
      if (validTickets.length === 0) {
        delete formData.ticketTypes
      } else {
        formData.ticketTypes = validTickets
      }
    }

    // Required fields check
    const requiredFields = [
      { name: "title", label: "Event Title" },
      { name: "category", label: "Event Category" },
      { name: "description", label: "Event Description" },
      { name: "startDate", label: "Start Date" },
      { name: "startTime", label: "Start Time" },
      { name: "organiserName", label: "Organizer Name" },
      { name: "organiserEmail", label: "Organizer Email" },
    ]

    const locationFields =
      formData.locationType === "physical"
        ? [
            { name: "venue", label: "Venue" },
            { name: "address", label: "Address" },
            { name: "city", label: "City" },
            { name: "country", label: "Country" },
          ]
        : [{ name: "onlineLink", label: "Online Link" }]

    const missingFields = [...requiredFields, ...locationFields].filter(
      (field) => !formData[field.name]
    )

    if (missingFields.length > 0) {
      return {
        valid: false,
        message: `Please fill in the following required fields: ${missingFields
          .map((f) => f.label)
          .join(", ")}`,
      }
    }

    // Banner image validation
    if (!bannerImage) {
      return {
        valid: false,
        message: "Please upload a banner image for your event",
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.organiserEmail)) {
      return {
        valid: false,
        message: "Please enter a valid email address for the organizer",
      }
    }

    // Date validation
    const startDate = new Date(formData.startDate)
    const endDate = formData.endDate ? new Date(formData.endDate) : null
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (startDate < today) {
      return {
        valid: false,
        message: "Start date cannot be in the past",
      }
    }

    if (
      formData.registrationDeadline &&
      new Date(formData.registrationDeadline) >= startDate
    ) {
      return {
        valid: false,
        message: "Registration deadline must be before the event start date",
      }
    }

    if (endDate && endDate < startDate) {
      return {
        valid: false,
        message: "End date cannot be before start date",
      }
    }

    if (
      formData.startDate === formData.endDate &&
      formData.endTime &&
      formData.startTime &&
      formData.endTime <= formData.startTime
    ) {
      return {
        valid: false,
        message: "End time must be after start time on the same date",
      }
    }

    const socialMediaFields = Object.entries(formData.socialMedia || {})
    const urlRegex = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/

    for (const [platform, url] of socialMediaFields) {
      if (url && !urlRegex.test(url)) {
        return {
          valid: false,
          message: `Please enter a valid URL for ${
            platform.charAt(0).toUpperCase() + platform.slice(1)
          }`,
        }
      }
    }

    return { valid: true }
  }

  const handleSubmit = async () => {
    // Clear any previous errors
    setErrorMessage("")

    if (!user) {
      setErrorMessage("You must be logged in to submit an event.")
      return
    }

    // Check if banner image exists
    if (!bannerImage) {
      setErrorMessage("Please upload a banner image for your event.")
      return
    }

    // Form validation
    const validation = validateForm()
    if (!validation.valid) {
      setErrorMessage(validation.message)
      return
    }

    setSubmissionState("submitting")

    try {
      // Import the API utility
      const { eventApi } = await import("../../../../utils/api.js")

      // Create a clean copy of form data for submission
      const cleanFormData = { ...formData }

      // Remove any undefined/null values
      Object.keys(cleanFormData).forEach((key) => {
        if (cleanFormData[key] === undefined || cleanFormData[key] === null) {
          delete cleanFormData[key]
        }
      })

      // Add the banner image explicitly
      cleanFormData.bannerImage = bannerImage

      // Prepare the form data for submission
      const eventFormData = new FormData()

      // Process banner image first if it's base64 to ensure it's properly handled before form submission
      const processBannerImage = async () => {
        if (cleanFormData.bannerImage) {
          const value = cleanFormData.bannerImage
          if (value instanceof File || value instanceof Blob) {
            eventFormData.append("bannerImage", value, "banner.jpg")
            return
          } else if (typeof value === "string" && value.startsWith("data:")) {
            try {
              // Convert base64 to blob and append - using await to ensure it completes
              const response = await fetch(value)
              const blob = await response.blob()
              eventFormData.append("bannerImage", blob, "banner.jpg")
            } catch (err) {
              console.error("Error converting base64 to blob:", err)
              // Still append the original value as fallback
              eventFormData.append("bannerImage", value)
            }
          } else {
            // It's a URL, just add it as is
            eventFormData.append("bannerImage", value)
          }
        }
      }

      // Process banner image first
      await processBannerImage()

      // Add all the data as JSON except for file fields and banner image (already processed)
      Object.entries(cleanFormData).forEach(([key, value]) => {
        if (
          key !== "images" &&
          key !== "galleryImages" &&
          key !== "bannerImage"
        ) {
          if (
            typeof value === "object" &&
            !(value instanceof File) &&
            !(value instanceof Blob)
          ) {
            eventFormData.append(key, JSON.stringify(value))
          } else {
            eventFormData.append(key, value)
          }
        }
      })

      // Handle gallery images if any
      if (
        cleanFormData.galleryImages &&
        cleanFormData.galleryImages.length > 0
      ) {
        cleanFormData.galleryImages.forEach((img, index) => {
          // Check if the image is a string (URL) or a File/Blob
          if (img instanceof File || img instanceof Blob) {
            eventFormData.append(`galleryImage_${index}`, img)
          } else if (typeof img === "string" && img.startsWith("data:")) {
            // Convert base64 to blob and append
            fetch(img)
              .then((res) => res.blob())
              .then((blob) => {
                eventFormData.append(
                  `galleryImage_${index}`,
                  blob,
                  `image_${index}.jpg`
                )
              })
              .catch((err) =>
                console.error("Error converting base64 to blob:", err)
              )
          } else {
            // It's a URL, just add it as is
            eventFormData.append(`galleryImage_${index}`, img)
          }
        })
      }

      // Get authentication headers
      const authHeaders = getAuthHeader()

      // Use the API utility to create the event with auth headers
      const responseData = await eventApi.createEvent(
        eventFormData,
        authHeaders
      )
      console.log("Response from server:", responseData)

      setSubmissionState("success")
      setSuccessMessage("Event submitted successfully!")
    } catch (error) {
      console.error("Error submitting event:", error)
      setSubmissionState("error")
      setErrorMessage(
        error.message || "Error submitting event. Please try again."
      )
    }
  }

  const resetSubmission = () => {
    setSubmissionState("initial")
    setErrorMessage("")
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Ready to Submit Your Event?
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Review all the details in the preview above before submitting. Once
          submitted, you can make changes from your event dashboard.
        </p>

        {/* Banner Image Preview */}
        {bannerImage && (
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <Image
                size={16}
                className="mr-2"
              />{" "}
              Event Banner
            </h4>
            <div className="mt-2">
              <img
                src={
                  typeof bannerImage === "string"
                    ? bannerImage
                    : URL.createObjectURL(bannerImage)
                }
                alt="Event banner"
                className="max-h-48 rounded-md object-contain mx-auto"
              />
            </div>
          </div>
        )}

        {/* Terms and Conditions Checkbox */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={() => setAgreedToTerms(!agreedToTerms)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="terms"
                className="font-medium text-gray-700"
              >
                I agree to the terms and conditions
              </label>
              <p className="text-gray-500">
                By creating this event, you agree to our Terms of Service and
                Privacy Policy. You confirm that the information provided is
                accurate and that you have the right to publish this event.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 p-4 rounded-md border border-red-200 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle
                  className="h-5 w-5 text-red-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Validation Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{errorMessage}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submission Status */}
        {submissionState === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 p-4 rounded-md border border-green-200 mb-6"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <Check
                  className="h-5 w-5 text-green-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Submission successful
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>{successMessage}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {submissionState === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 p-4 rounded-md border border-red-200 mb-6"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle
                  className="h-5 w-5 text-red-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  There was an error with your submission
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{errorMessage}</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={resetSubmission}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              submissionState === "submitting" || submissionState === "success"
            }
            className={`flex-1 flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white 
              ${
                submissionState === "submitting" ||
                submissionState === "success"
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
          >
            {submissionState === "submitting" ? (
              <>
                <RefreshCw
                  size={20}
                  className="mr-2 animate-spin"
                />
                Submitting...
              </>
            ) : submissionState === "success" ? (
              <>
                <Check
                  size={20}
                  className="mr-2"
                />
                Submitted
              </>
            ) : (
              <>
                <Send
                  size={20}
                  className="mr-2"
                />
                Submit Event
              </>
            )}
          </button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Need help? Contact our support team at support@example.com
        </p>
      </motion.div>
    </div>
  )
}

export default FormSubmit
