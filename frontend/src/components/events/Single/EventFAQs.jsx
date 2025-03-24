import React, { useState } from "react"
import { motion } from "framer-motion"
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react"

const EventFAQs = ({ faqs }) => {
  const [expandedItems, setExpandedItems] = useState({})

  const toggleItem = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.7 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <HelpCircle
          size={24}
          className="mr-2 text-blue-600"
        />
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isExpanded = expandedItems[index] || false

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className={`w-full text-left p-4 flex justify-between items-center font-medium transition-colors ${
                  isExpanded ? "bg-blue-50" : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <span>{faq.question}</span>
                {isExpanded ? (
                  <ChevronUp
                    size={18}
                    className="text-blue-600 flex-shrink-0"
                  />
                ) : (
                  <ChevronDown
                    size={18}
                    className="text-gray-600 flex-shrink-0"
                  />
                )}
              </button>

              {isExpanded && (
                <div className="p-4 border-t border-gray-200 bg-white">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {faq.answer}
                  </p>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default EventFAQs
