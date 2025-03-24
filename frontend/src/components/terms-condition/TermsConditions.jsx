import React, { useState } from "react"
import { motion } from "framer-motion"
import {
  ChevronDown,
  ChevronUp,
  FileCheck,
  Shield,
  Clock,
  Globe,
  AlertTriangle,
} from "lucide-react"
import termsData from "./termsData" // Import the mock data

const TermsAndConditions = () => {
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    userAgreement: false,
    privacy: false,
    limitations: false,
    termination: false,
    governing: false,
  })

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const sectionVariants = {
    collapsed: { height: 0, opacity: 0, overflow: "hidden" },
    expanded: { height: "auto", opacity: 1, transition: { duration: 0.5 } },
  }

  // Function to render the appropriate icon
  const renderIcon = (iconName) => {
    switch (iconName) {
      case "FileCheck":
        return <FileCheck className="h-5 w-5 text-blue-500 mr-3" />
      case "Shield":
        return <Shield className="h-5 w-5 text-blue-500 mr-3" />
      case "Clock":
        return <Clock className="h-5 w-5 text-blue-500 mr-3" />
      case "Globe":
        return <Globe className="h-5 w-5 text-blue-500 mr-3" />
      case "AlertTriangle":
        return <AlertTriangle className="h-5 w-5 text-blue-500 mr-3" />
      default:
        return <FileCheck className="h-5 w-5 text-blue-500 mr-3" />
    }
  }

  return (
    <section className="pt-16 md:pt-20">
      <motion.div
        className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 md:px-12 lg:px-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className="p-6 md:p-10 border-b border-gray-200">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Terms and Conditions
              </h1>
              <p className="text-gray-600 mb-4">
                Last Updated: {termsData.lastUpdated}
              </p>
              <p className="text-gray-600">
                Please read these terms and conditions carefully before using
                our service.
              </p>
            </motion.div>
          </div>

          <div className="p-6 md:p-10">
            {termsData.sections.map((section) => (
              <div
                className="mb-6"
                key={section.id}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors duration-300"
                >
                  <div className="flex items-center">
                    {renderIcon(section.icon)}
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                      {section.title}
                    </h2>
                  </div>
                  {expandedSections[section.id] ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                <motion.div
                  variants={sectionVariants}
                  initial="collapsed"
                  animate={
                    expandedSections[section.id] ? "expanded" : "collapsed"
                  }
                  className="mt-4 ml-12 text-gray-700"
                >
                  {section.content.map((paragraph, idx) =>
                    Array.isArray(paragraph) ? (
                      <ul
                        className="list-disc pl-5 mb-4 space-y-2"
                        key={`list-${idx}`}
                      >
                        {paragraph.map((item, itemIdx) => (
                          <li key={`item-${itemIdx}`}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p
                        className="mb-4"
                        key={`para-${idx}`}
                      >
                        {paragraph}
                      </p>
                    )
                  )}
                </motion.div>
              </div>
            ))}
          </div>

          <div className="p-6 md:p-10 bg-gray-50 border-t border-gray-200">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <p className="text-gray-600 text-sm mb-4 md:mb-0">
                  By using our service, you acknowledge that you have read and
                  agree to these Terms and Conditions.
                </p>
                <motion.button
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Accept Terms
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default TermsAndConditions
