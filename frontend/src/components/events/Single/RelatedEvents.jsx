import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { eventData } from "./eventData"

const RelatedEvents = ({ category, currentEventId }) => {
  const [relatedEvents, setRelatedEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, fetch from API
    // const fetchRelatedEvents = async () => {
    //   const response = await fetch(`/api/events?category=${category}&exclude=${currentEventId}&limit=3`)
    //   const data = await response.json()
    //   setRelatedEvents(data)
    //   setLoading(false)
    // }

    // For now, use the sample data
    const fetchSampleRelatedEvents = () => {
      const related = eventData
        .filter(
          (event) =>
            event.category === category && event.id !== parseInt(currentEventId)
        )
        .slice(0, 3)

      setTimeout(() => {
        setRelatedEvents(related)
        setLoading(false)
      }, 300)
    }

    fetchSampleRelatedEvents()
  }, [category, currentEventId])

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Related Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-200" />
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (relatedEvents.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.8 }}
      className="mt-12"
    >
      <h2 className="text-2xl font-bold mb-4">Related Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <Link to={`/events/${event.id}`}>
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-gray-900 hover:text-blue-600 transition-colors">
                  {event.title}
                </h3>
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <Calendar
                    size={14}
                    className="mr-1 text-blue-600"
                  />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin
                    size={14}
                    className="mr-1 text-blue-600"
                  />
                  <span>
                    {event.locationType === "physical"
                      ? `${event.venue}, ${event.city}`
                      : event.locationType === "online"
                      ? "Online Event"
                      : "Hybrid Event"}
                  </span>
                </div>
                <div className="mt-3 flex justify-end">
                  <span className="text-blue-600 text-sm font-medium flex items-center hover:underline">
                    View Details
                    <ArrowRight
                      size={14}
                      className="ml-1"
                    />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default RelatedEvents
