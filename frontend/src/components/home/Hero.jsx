import React from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <div className="relative w-full pt-16 md:pt-20">
      {/* Enhanced Split Container with improved styling */}
      <div className="w-full h-[80vh] flex flex-col md:flex-row relative overflow-hidden">
        {/* Diagonal split effect with gradient overlay */}
        <div className="absolute inset-0 bg-black"></div>
        {/* <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 via-blue-800/60 to-transparent"></div>
        <div className="absolute md:block hidden inset-y-0 right-0 w-1/2 bg-gradient-to-l from-blue-800/50 to-transparent"></div> */}

        {/* Decorative elements */}
        <div className="absolute top-10 right-24 w-32 h-32 rounded-full bg-white/5 backdrop-blur-xl"></div>
        <div className="absolute bottom-20 left-12 w-48 h-48 rounded-full bg-blue-500/5 backdrop-blur-xl"></div>

        {/* Left Content Section - Same as original */}
        <div className="w-full md:w-1/2 flex items-center relative z-10">
          <div className="container mx-auto px-8 py-12 md:py-0 md:pl-16 lg:pl-24">
            <div className="max-w-lg">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-10 capitalize"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Start your event journey here
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.button
                  className="px-8 py-4 bg-white text-blue-900 text-lg font-bold rounded-4xl flex items-center gap-2 hover:bg-blue-50 transition-colors shadow-lg capitalize"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started free <ArrowRight size={20} />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right Image Section - Modified to touch top and bottom */}
        <div className="w-full md:w-1/2 relative z-10 h-full">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 overflow-hidden shadow-2xl"
          >
            {/* Fallback color in case image fails to load */}
            <div className="absolute inset-0 bg-blue-800"></div>

            {/* Image with proper error handling */}
            <img
              src="/hero.jpg"
              alt="Scenic destination landscape"
              className="w-full h-full object-cover z-10 relative"
              onError={(e) => {
                // If image fails, use a placeholder
                e.target.onerror = null
                e.target.src = "/api/placeholder/800/600"
              }}
            />

            {/* Enhanced border with animation */}
            {/* <div className="absolute inset-0 border-4 border-white/20 z-20 rounded-2xl">
              <div className="absolute -top-2 -right-2 w-16 h-16 bg-blue-400/20 blur-lg rounded-full"></div>
              <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-indigo-400/20 blur-lg rounded-full"></div>
            </div> */}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
