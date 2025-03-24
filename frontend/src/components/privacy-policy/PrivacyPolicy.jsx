import React, { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Shield,
  FileText,
  Mail,
} from "lucide-react"
import { privacyPolicyData } from "./PrivacyPolicyData"

const PrivacyPolicy = () => {
  const [expandedSections, setExpandedSections] = useState({})
  const sectionRefs = useRef({})

  const toggleSection = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const scrollToSection = (index) => {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
    // Expand the section when scrolled to
    setExpandedSections((prev) => ({
      ...prev,
      [index]: true,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      {/* Header */}
      <motion.header
        className="bg-indigo-700 text-white py-6 md:py-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold mb-2">
                Privacy Policy
              </h1>
              <div className="flex items-center text-indigo-200 text-sm md:text-base">
                <Clock className="w-4 h-4 mr-1" />
                <p>Last Updated: {privacyPolicyData.lastUpdated}</p>
              </div>
            </div>
            <Shield className="w-12 h-12 md:w-16 md:h-16 text-indigo-200" />
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Table of Contents - Hidden on mobile, visible on md screens and up */}
          <motion.div
            className="hidden md:block w-1/4 bg-white p-6 rounded-lg shadow-md h-fit sticky top-24"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-indigo-600" />
              Table of Contents
            </h2>
            <ul className="space-y-2">
              {privacyPolicyData.sections.map((section, index) => (
                <li key={`toc-${index}`}>
                  <button
                    onClick={() => scrollToSection(index)}
                    className="text-indigo-600 hover:text-indigo-800 text-left w-full py-1 text-sm transition-colors duration-200"
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="md:w-3/4 bg-white p-6 md:p-8 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {privacyPolicyData.sections.map((section, index) => (
              <div
                key={`section-${index}`}
                ref={(el) => (sectionRefs.current[index] = el)}
                className={`mb-8 ${
                  index > 0 ? "pt-6 border-t border-gray-200" : ""
                }`}
              >
                <motion.button
                  className="w-full flex justify-between items-center text-left"
                  onClick={() => toggleSection(index)}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                    {section.title}
                  </h2>
                  {section.subsections ? (
                    expandedSections[index] ? (
                      <ChevronUp className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-indigo-600" />
                    )
                  ) : null}
                </motion.button>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 text-gray-600"
                >
                  <p>{section.content}</p>
                </motion.div>

                {section.subsections && (
                  <AnimatePresence>
                    {expandedSections[index] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pl-4 border-l-2 border-indigo-200"
                      >
                        {section.subsections.map((subsection, subIdx) => (
                          <div
                            key={`subsection-${index}-${subIdx}`}
                            className="mb-4"
                          >
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                              {subsection.title}
                            </h3>
                            <p className="text-gray-600">
                              {subsection.content}
                            </p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}

            {/* Contact Section */}
            <motion.div
              className="mt-12 p-6 bg-indigo-50 rounded-lg border border-indigo-100"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start md:items-center flex-col md:flex-row">
                <Mail className="w-10 h-10 text-indigo-600 mb-4 md:mb-0 md:mr-6" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Have questions about our privacy practices?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We're here to help! Contact our privacy team for any
                    concerns or inquiries.
                  </p>
                  <a
                    href="mailto:privacy@example.com"
                    className="inline-block bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
