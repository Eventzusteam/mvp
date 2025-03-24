import React, { useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import FilterSearch from "./filterSearch/FilterSearch"

export default function Hero() {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  )
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3])

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="relative w-full pt-8 md:pt-12">
      <div className="relative w-full h-[50vh] overflow-hidden">
        {/* Black background with image overlay */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-black"></div>
          <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-60"></div>
        </div>

        {/* Centered text overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white px-4">
          <motion.h1
            style={{ opacity }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2"
          >
            Discover Amazing Events
          </motion.h1>
          <motion.p
            style={{ opacity }}
            className="text-lg md:text-xl mb-4 max-w-2xl"
          >
            Find the perfect events happening around you
          </motion.p>

          {/* FilterSearch component with preserved styling */}
          {/* <div className="w-full max-w-4xl">
            <div className="filter-search-wrapper">
              <FilterSearch />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}
