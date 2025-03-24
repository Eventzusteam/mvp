import React, { useState, useRef } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Store,
  Star,
} from "lucide-react"
import { motion } from "framer-motion"

export default function FeaturedVendors() {
  // Sample featured vendors data
  const vendors = [
    {
      id: 1,
      name: "Eco Solutions",
      category: "Sustainable Products",
      image: "/hero.jpg",
      description:
        "Award-winning eco-friendly products for events of all sizes.",
      rating: 4.9,
      experience: "10+ years",
    },
    {
      id: 2,
      name: "Tech Innovations",
      category: "Technology",
      image: "/hero.jpg",
      description:
        "Cutting-edge tech gadgets and solutions for modern exhibitions.",
      rating: 4.7,
      experience: "8+ years",
    },
    {
      id: 3,
      name: "Gourmet Delights",
      category: "Food & Beverage",
      image: "/hero.jpg",
      description:
        "Premium artisanal food products from renowned chefs worldwide.",
      rating: 4.8,
      experience: "15+ years",
    },
    {
      id: 4,
      name: "Artistic Creations",
      category: "Arts & Crafts",
      image: "/hero.jpg",
      description:
        "Handcrafted artistic items and decor for unique event experiences.",
      rating: 4.6,
      experience: "12+ years",
    },
    {
      id: 5,
      name: "Wellness Essentials",
      category: "Health & Wellness",
      image: "/hero.jpg",
      description:
        "Natural products for mind and body, perfect for wellness events.",
      rating: 4.9,
      experience: "7+ years",
    },
    {
      id: 6,
      name: "Fashion Forward",
      category: "Apparel",
      image: "/hero.jpg",
      description:
        "Trendy and sustainable clothing options for fashion-focused events.",
      rating: 4.5,
      experience: "9+ years",
    },
    {
      id: 7,
      name: "Home Harmony",
      category: "Home Goods",
      image: "/hero.jpg",
      description:
        "Quality furniture and home accessories for exquisite event displays.",
      rating: 4.7,
      experience: "11+ years",
    },
    {
      id: 8,
      name: "Garden Wonders",
      category: "Gardening",
      image: "/hero.jpg",
      description:
        "Plants and gardening supplies to create stunning natural backdrops.",
      rating: 4.8,
      experience: "14+ years",
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const carousel = useRef()

  // Fixed to always show 4 items
  const itemsToShow = 4
  const totalVendors = vendors.length

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalVendors)
  }

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + totalVendors) % totalVendors
    )
  }

  // Get visible items considering the circular nature
  const getVisibleItems = () => {
    const visibleItems = []
    for (let i = 0; i < itemsToShow; i++) {
      const index = (currentIndex + i) % totalVendors
      visibleItems.push(vendors[index])
    }
    return visibleItems
  }

  // Generate star rating display
  const renderRating = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < Math.floor(rating)
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            }
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating}</span>
      </div>
    )
  }

  return (
    <section className="py-16 px-4 bg-blue-50">
      <div className="featured-vendors-wrapper rounded-2xl p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-blue-900">
              Featured Vendors
            </h2>
            <motion.button
              className="flex items-center text-blue-600 hover:text-white hover:bg-blue-600 transition-colors font-medium px-4 py-2 border border-blue-600 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Register With Us <ArrowRight className="ml-2 w-5 h-5" />
            </motion.button>
          </div>

          <div className="carousel-container">
            <div className="relative w-full">
              {/* Left navigation button */}
              <motion.button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-blue-100 transition-colors"
                aria-label="Previous vendors"
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
                  {getVisibleItems().map((vendor) => (
                    <motion.div
                      key={vendor.id}
                      className="w-1/4 px-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-lg transition-all border border-gray-100"
                        style={{ height: "400px" }} // Matching the events section height
                      >
                        <div className="relative">
                          <img
                            src={vendor.image}
                            alt={vendor.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-0 right-0 m-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                            {vendor.category}
                          </div>
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                          <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                            <Store size={16} />
                            {vendor.experience}
                          </div>
                          <h3 className="text-xl font-semibold mt-1 mb-2 text-blue-900">
                            {vendor.name}
                          </h3>
                          <p className="text-gray-600 text-sm flex-grow">
                            {vendor.description}
                          </p>
                          <div className="mt-3">
                            {renderRating(vendor.rating)}
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <motion.button
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                              whileHover={{ x: 5 }}
                            >
                              Visit Vendor{" "}
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
                aria-label="Next vendors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-6 h-6 text-blue-700" />
              </motion.button>
            </div>
          </div>

          {/* View All Vendors button at the bottom right corner */}
          <div className="flex justify-end mt-6">
            <motion.button
              className="flex items-center text-blue-600 hover:text-white hover:bg-blue-600 transition-colors font-medium px-4 py-2 border border-blue-600 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn About Our Services <ArrowRight className="ml-2 w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}
