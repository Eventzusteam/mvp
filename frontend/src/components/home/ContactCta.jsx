import React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Mail } from "lucide-react"

export default function ContactCta() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative py-10 md:py-16 overflow-hidden"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/api/placeholder/1600/600"
          alt="Contact background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center text-white">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3"
          >
            Ready to Get Started?
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-base md:text-lg opacity-90 mb-6"
          >
            Reach out to our team and discover how we can help transform your
            business with our innovative solutions.
          </motion.p>

          <div className="flex justify-center items-center mb-6">
            <motion.a
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              href="mailto:contact@example.com"
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <Mail size={18} />
              <span>contact@example.com</span>
            </motion.a>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium flex items-center gap-2 mx-auto"
            >
              Contact Us
              <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
