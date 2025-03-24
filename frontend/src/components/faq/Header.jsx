// Header.jsx
import React from "react"
import { motion } from "framer-motion"

const Header = () => {
  return (
    <div className="text-center mb-16 pt-14 md:pt-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Find answers to common questions about our platform.
        </p>
      </motion.div>
    </div>
  )
}

export default Header
