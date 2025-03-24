import React, { useState, useRef } from "react"
import { ChevronLeft, ChevronRight, ArrowRight, Calendar } from "lucide-react"
import { motion } from "framer-motion"

export default function FeaturedEvents() {
  // Sample featured events data
  const events = [
    {
      id: 1,
      title: "Music Festival",
      date: "April 15, 2025",
      image: "/hero.jpg",
      description:
        "Annual music festival featuring top artists and bands from around the world.",
      attendees: "10,000+",
      category: "Entertainment",
    },
    {
      id: 2,
      title: "Tech Conference",
      date: "May 10, 2025",
      image: "/hero.jpg",
      description:
        "Join industry leaders in technology for keynotes and networking.",
      attendees: "5,000+",
      category: "Technology",
    },
    {
      id: 3,
      title: "Food & Wine Expo",
      date: "June 5, 2025",
      image: "/hero.jpg",
      description:
        "Taste the finest cuisines and wines from renowned chefs and sommeliers.",
      attendees: "8,500+",
      category: "Culinary",
    },
    {
      id: 4,
      title: "Art Exhibition",
      date: "July 20, 2025",
      image: "/hero.jpg",
      description:
        "Featuring contemporary artists showcasing their latest collections.",
      attendees: "3,000+",
      category: "Arts",
    },
    {
      id: 5,
      title: "Sports Tournament",
      date: "August 8, 2025",
      image: "/hero.jpg",
      description:
        "Championship games for all ages with professional athletes in attendance.",
      attendees: "15,000+",
      category: "Sports",
    },
    {
      id: 6,
      title: "Business Summit",
      date: "September 15, 2025",
      image: "/hero.jpg",
      description:
        "Network with entrepreneurs and investors from Fortune 500 companies.",
      attendees: "2,000+",
      category: "Business",
    },
    {
      id: 7,
      title: "Health & Wellness Fair",
      date: "October 3, 2025",
      image: "/hero.jpg",
      description:
        "Discover the latest in wellness trends with expert-led workshops.",
      attendees: "4,500+",
      category: "Health",
    },
    {
      id: 8,
      title: "Film Festival",
      date: "November 12, 2025",
      image: "/hero.jpg",
      description: "Premieres of independent films with director Q&A sessions.",
      attendees: "6,000+",
      category: "Entertainment",
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const carousel = useRef()

  // Fixed to always show 4 items
  const itemsToShow = 4
  const totalEvents = events.length

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalEvents)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalEvents) % totalEvents)
  }

  // Get visible items considering the circular nature
  const getVisibleItems = () => {
    const visibleItems = []
    for (let i = 0; i < itemsToShow; i++) {
      const index = (currentIndex + i) % totalEvents
      visibleItems.push(events[index])
    }
    return visibleItems
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="featured-events-wrapper rounded-2xl p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-blue-900">
              Featured Events
            </h2>
            <motion.button
              className="flex items-center text-blue-600 hover:text-white hover:bg-blue-600 transition-colors font-medium px-4 py-2 border border-blue-600 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Events <ArrowRight className="ml-2 w-5 h-5" />
            </motion.button>
          </div>

          <div className="carousel-container">
            <div className="relative w-full">
              {/* Left navigation button */}
              <motion.button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-blue-100 transition-colors"
                aria-label="Previous events"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-6 h-6 text-blue-700" />
              </motion.button>

              {/* Carousel container */}
              <div
                className="relative overflow-hidden w-full pb-5"
                ref={carousel}
              >
                <div className="flex transition-all duration-300 ease-in-out">
                  {getVisibleItems().map((event) => (
                    <motion.div
                      key={event.id}
                      className="w-1/4 px-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-lg transition-all border border-gray-100"
                        style={{ height: "400px" }} // Slightly taller for more content
                      >
                        <div className="relative">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-0 right-0 m-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                            {event.category}
                          </div>
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                          <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                            <Calendar size={16} />
                            {event.date}
                          </div>
                          <h3 className="text-xl font-semibold mt-1 mb-2 text-blue-900">
                            {event.title}
                          </h3>
                          <p className="text-gray-600 text-sm flex-grow">
                            {event.description}
                          </p>
                          <div className="mt-3 flex items-center text-sm text-gray-500">
                            <span className="font-medium">
                              {event.attendees}
                            </span>{" "}
                            expected attendees
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <motion.button
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                              whileHover={{ x: 5 }}
                            >
                              Learn More{" "}
                              <ArrowRight
                                size={16}
                                className="ml-1"
                              />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right navigation button */}
              <motion.button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-blue-100 transition-colors"
                aria-label="Next events"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-6 h-6 text-blue-700" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
