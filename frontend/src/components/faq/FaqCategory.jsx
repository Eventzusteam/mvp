// FaqCategory.jsx
import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react"
import FaqList from "./FaqList"

const FaqCategory = ({
  category,
  categoryData,
  isActive,
  setActiveCategory,
  index,
}) => {
  // Format category name for display (remove "Faq" suffix and capitalize)
  const displayName = category
    .replace("Faq", "")
    .replace(/([A-Z])/g, " $1")
    .trim()

  const toggleCategory = () => {
    setActiveCategory(isActive ? null : category)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <button
        onClick={toggleCategory}
        className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
      >
        <div className="flex items-center">
          <HelpCircle className="h-6 w-6 text-indigo-600 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900">
            {categoryData.title || displayName}
          </h3>
        </div>
        <div>
          {isActive ? (
            <ChevronUp className="h-6 w-6 text-indigo-600" />
          ) : (
            <ChevronDown className="h-6 w-6 text-indigo-600" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              <FaqList faqs={categoryData.faqs} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default FaqCategory
