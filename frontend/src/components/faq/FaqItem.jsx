// FaqItem.jsx
import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"

const FaqItem = ({ faq, isActive, toggle }) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={toggle}
        className="w-full px-4 py-3 text-left flex justify-between items-center focus:outline-none bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <h4 className="text-base font-medium text-gray-900">{faq.question}</h4>
        <div>
          {isActive ? (
            <ChevronUp className="h-5 w-5 text-indigo-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-indigo-500" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 bg-white">
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FaqItem
