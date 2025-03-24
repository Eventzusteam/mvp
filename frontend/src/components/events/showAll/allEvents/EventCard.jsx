import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { MapPin, Calendar, Clock, Image as ImageIcon } from "lucide-react"

const EventCard = ({ event, cardSize }) => {
  // Safely extract properties with fallbacks
  const eventData = event.eventObject || event
  const { _id: id, title, description, isVideo } = eventData
  const [imageLoadError, setImageLoadError] = useState(false)

  // Add debugging on component mount
  useEffect(() => {
    console.log(`EventCard mounted for event ${id}`, {
      eventObject: event,
      bannerImage: event.bannerImage,
      image: event.image,
      images: event.images,
      featuredImage: event.featuredImage,
      cloudinaryUrl: event.cloudinaryUrl,
    })
  }, [event, id])

  // Updated image selection logic with detailed logging
  const getImageUrl = () => {
    console.log("Full event object for debugging:", event)

    const eventData = event.eventObject || event

    // First check for bannerImage (the primary image field)
    const rawImage =
      eventData.bannerImage ||
      eventData.image ||
      (eventData.images && eventData.images.length > 0
        ? eventData.images[0]
        : null) ||
      eventData.featuredImage ||
      eventData.cloudinaryUrl

    console.log(`Raw image found:`, rawImage)

    if (!rawImage) {
      console.log(`No image found for event ${id}`)
      return null
    }

    // Handle cloudinary URLs specifically
    if (typeof rawImage === "string") {
      console.log(`Processing string image URL: ${rawImage}`)

      // For Cloudinary URLs, ensure they use https
      if (rawImage.includes("cloudinary.com")) {
        const secureUrl = rawImage.replace("http://", "https://")
        console.log(`Using Cloudinary URL for event ${id}:`, secureUrl)
        return secureUrl
      }

      // Handle other URLs
      if (rawImage.startsWith("http")) {
        console.log(`Using absolute URL: ${rawImage}`)
        return rawImage
      } else if (rawImage.startsWith("/")) {
        const fullUrl = `${import.meta.env.VITE_API_URL}${rawImage}`
        console.log(`Using API-prefixed URL: ${fullUrl}`)
        return fullUrl
      } else {
        const fullUrl = `${import.meta.env.VITE_API_URL}/${rawImage}`
        console.log(`Using API-prefixed URL with slash: ${fullUrl}`)
        return fullUrl
      }
    }

    // Handle File/Blob objects
    if (rawImage instanceof Blob || rawImage instanceof File) {
      const objectUrl = URL.createObjectURL(rawImage)
      console.log(`Created object URL for blob/file: ${objectUrl}`)
      return objectUrl
    }

    console.log(`No valid image format found, returning null`)
    // return null
    return event.bannerImage || null
  }

  const imageUrl = getImageUrl()

  // Handle date, time, location with fallbacks
  const date = eventData.date || eventData.startDate || "Date TBD"
  const time = eventData.time || eventData.startTime || "Time TBD"
  const location =
    eventData.location ||
    eventData.venue ||
    (eventData.city ? `${eventData.city}, ${eventData.country}` : "Location TBD")

  // Truncate description based on card size
  const truncatedDescription =
    cardSize === "compact"
      ? description?.length > 60
        ? `${description.substring(0, 60)}...`
        : description
      : description?.length > 100
      ? `${description.substring(0, 100)}...`
      : description

  // Adjust card height based on size
  const imageHeight = cardSize === "compact" ? "h-36" : "h-48"
  const titleSize = cardSize === "compact" ? "text-lg" : "text-xl"
  const padding = cardSize === "compact" ? "p-3" : "p-4"

  // Modified to provide more detailed errors
  const handleImageError = (e) => {
    const imgSrc = e.target.src
    console.error(`Image failed to load: ${imgSrc} for event ${id}`)
    console.error("Error details:", e)
    setImageLoadError(true)
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Date TBD"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (e) {
      console.error("Error formatting date:", e)
      return dateString
    }
  }

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "Time TBD"

    // Handle HH:MM format
    if (/^\d{1,2}:\d{2}$/.test(timeString)) {
      try {
        const [hours, minutes] = timeString.split(":").map(Number)
        const date = new Date()
        date.setHours(hours)
        date.setMinutes(minutes)
        return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      } catch (e) {
        console.error("Error formatting time:", e)
      }
    }

    return timeString
  }

  const displayDate = formatDate(date)
  const displayTime = formatTime(time)

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col"
    >
      <div className={`relative overflow-hidden ${imageHeight}`}>
        {isVideo && imageUrl ? (
          <div className="relative w-full h-full">
            <video
              className="w-full h-full object-cover"
              poster={imageUrl}
              crossOrigin="anonymous"
            >
              <source
                src={imageUrl}
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white bg-opacity-75 rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-16 border-l-blue-600 ml-1"></div>
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center bg-gray-100"
          >
            {/* Show a default image icon if there's no image or if there was an error */}
            {!imageUrl || imageLoadError ? (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <ImageIcon
                  size={48}
                  className="text-gray-400 mb-2"
                />
                <span className="text-gray-500 text-sm">
                  No Image Available
                </span>
              </div>
            ) : (
              <img
                src={imageUrl}
                alt={title || "Event"}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
                onError={handleImageError}
              />
            )}
          </motion.div>
        )}
      </div>

      <div className={`${padding} flex flex-col flex-grow`}>
        <h3 className={`${titleSize} font-bold italic text-gray-900 mb-2`}>
          {title || "Untitled Event"}
        </h3>

        <div className="flex items-center mb-2 text-gray-600">
          <Calendar
            size={16}
            className="mr-2 text-blue-600"
          />
          <span>{displayDate}</span>
        </div>

        <div className="flex items-center mb-2 text-gray-600">
          <Clock
            size={16}
            className="mr-2 text-blue-600"
          />
          <span>{displayTime}</span>
        </div>

        <div className="flex items-center mb-3 text-gray-600">
          <MapPin
            size={16}
            className="mr-2 text-blue-600"
          />
          <span>{location}</span>
        </div>

        <p className="text-gray-700 mb-4 flex-grow">
          {truncatedDescription || "No description provided."}
        </p>

        <Link
          to={`/event/${id}`}
          className="block w-full"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
            }}
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-300 mt-auto"
          >
            View Details
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )
}

export default EventCard
