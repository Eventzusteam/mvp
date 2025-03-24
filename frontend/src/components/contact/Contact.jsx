import React from "react"
import { motion } from "framer-motion"
import ContactForm from "./ContactForm"
// import ContactInfo from "./ContactInfo"

// Sleek Contact Component with event management theme
const Contact = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="py-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white pt-28 md:pt-32"
    >
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-16 h-16 rounded-full bg-indigo-300"></div>
        <div className="absolute top-12 left-1/2 w-32 h-32 rounded-full bg-blue-200"></div>
        <div className="absolute top-8 right-1/4 w-20 h-20 rounded-full bg-indigo-200"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 sm:text-5xl">
            Contact Us
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-xl mt-4 mx-auto text-lg text-gray-600"
          >
            Let us help you create your perfect event
          </motion.p>
        </motion.div>

        <div className="flex justify-center">
          <ContactForm />
          {/* <ContactInfo /> */}
        </div>
      </div>
    </motion.section>
  )
}

export default Contact
