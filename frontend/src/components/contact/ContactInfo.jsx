import React from "react"
import { motion } from "framer-motion"
import { Mail } from "lucide-react"

const ContactInfo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full lg:w-1/3 h-fit"
    >
      {/* Contact Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Contact Information</h2>
        </div>

        <div className="p-8">
          {/* Email */}
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center shadow-md">
              <Mail className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800">Email Us</h3>
              <motion.a
                href="mailto:events@yourcompany.com"
                className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                events@yourcompany.com
              </motion.a>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
            <p className="text-gray-700 leading-relaxed">
              We create memorable experiences for all types of events. Our team
              of expert event planners will work closely with you to bring your
              vision to life with elegance and precision.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ContactInfo
