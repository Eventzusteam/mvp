import React from "react"
import { motion } from "framer-motion"
import { MapPin, Calendar, Clock, ArrowRight } from "lucide-react"

const ListEventCard = ({ event, cardSize }) => {
  const { id, title, image, date, time, location, description, isVideo } = event

  // Truncate description based on card size
  const truncatedDescription =
    cardSize === "compact"
      ? description.length > 60
        ? `${description.substring(0, 60)}...`
        : description
      : description.length > 150
      ? `${description.substring(0, 150)}...`
      : description

  return (
    <motion.div
      whileHover={{ x: 5 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 w-full flex ${
        cardSize === "compact" ? "h-24" : "h-40"
      }`}
    >
      <div
        className={`relative overflow-hidden ${
          cardSize === "compact" ? "w-24" : "w-40"
        }`}
      >
        {isVideo ? (
          <div className="relative w-full h-full">
            <video
              className="w-full h-full object-cover"
              poster={image}
            >
              <source
                src={image}
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-white bg-opacity-75 rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-blue-600 ml-1"></div>
              </div>
            </div>
          </div>
        ) : (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="p-3 flex-grow flex flex-col justify-between">
        <div>
          <h3
            className={`font-bold italic text-gray-900 ${
              cardSize === "compact" ? "text-base" : "text-xl"
            }`}
          >
            {title}
          </h3>

          <div
            className={`flex flex-wrap ${
              cardSize === "compact" ? "mt-1" : "mt-2"
            }`}
          >
            <div className="flex items-center mr-4 text-gray-600 text-sm">
              <Calendar
                size={14}
                className="mr-1 text-blue-600"
              />
              <span>{date}</span>
            </div>

            <div className="flex items-center mr-4 text-gray-600 text-sm">
              <Clock
                size={14}
                className="mr-1 text-blue-600"
              />
              <span>{time}</span>
            </div>

            <div className="flex items-center text-gray-600 text-sm">
              <MapPin
                size={14}
                className="mr-1 text-blue-600"
              />
              <span>{location}</span>
            </div>
          </div>

          {cardSize !== "compact" && (
            <p className="text-gray-700 text-sm mt-2">{truncatedDescription}</p>
          )}
        </div>

        <motion.button
          whileHover={{ x: 5 }}
          className="flex items-center text-blue-600 text-sm font-medium mt-auto self-start"
          onClick={() => (window.location.href = `/event/${id}`)}
        >
          View Details{" "}
          <ArrowRight
            size={14}
            className="ml-1"
          />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default ListEventCard
