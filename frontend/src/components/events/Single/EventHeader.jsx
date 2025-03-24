import React from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, Clock, ArrowLeft } from "lucide-react"

const EventHeader = ({ event }) => {
  const {
    title,
    image,
    date,
    time,
    locationType,
    venue,
    city,
    onlineLink,
    isVideo,
  } = event

  // Format image URL properly
  // In EventHeader.jsx
  // Replace the current image formatting code with this improved version:

  const getImageUrl = () => {
    // First check for all possible image fields
    const rawImage =
      image ||
      (event.images && event.images.length > 0 ? event.images[0] : null) ||
      event.bannerImage ||
      event.featuredImage ||
      event.cloudinaryUrl

    if (!rawImage) {
      console.log(`No image found for event`)
      return "/placeholder-image.jpg"
    }

    // Handle cloudinary URLs specifically
    if (typeof rawImage === "string") {
      // For Cloudinary URLs, ensure they use https
      if (rawImage.includes("cloudinary.com")) {
        const secureUrl = rawImage.replace("http://", "https://")
        return secureUrl
      }

      // Handle other URLs
      if (rawImage.startsWith("http")) {
        return rawImage
      } else if (rawImage.startsWith("/")) {
        return `${import.meta.env.VITE_API_URL}${rawImage}`
      } else {
        return `${import.meta.env.VITE_API_URL}/${rawImage}`
      }
    }

    // Handle File/Blob objects
    if (rawImage instanceof Blob || rawImage instanceof File) {
      return URL.createObjectURL(rawImage)
    }

    return "/placeholder-image.jpg"
  }

  const imageUrl = getImageUrl()

  const locationText =
    locationType === "physical"
      ? `${venue}, ${city}`
      : locationType === "online"
      ? "Online Event"
      : `${venue}, ${city} & Online`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="relative h-64 md:h-96 w-full">
        {isVideo ? (
          <div className="relative w-full h-full">
            <video
              className="w-full h-full object-cover"
              poster={imageUrl}
              controls
            >
              <source
                src={imageUrl}
                type="video/mp4"
              />
            </video>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Image failed to load:", imageUrl)
              e.target.src = "/placeholder-image.jpg" // Fallback image
            }}
          />
        )}

        {/* Back button overlay */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all duration-300"
        >
          <ArrowLeft
            size={20}
            className="text-gray-800"
          />
        </button>
      </div>

      <div className="p-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {title}
        </h1>
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center text-gray-600">
            <Calendar
              size={20}
              className="mr-2 text-blue-600"
            />
            <span>{date}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock
              size={20}
              className="mr-2 text-blue-600"
            />
            <span>{time}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin
              size={20}
              className="mr-2 text-blue-600"
            />
            <span>{locationText}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default EventHeader
