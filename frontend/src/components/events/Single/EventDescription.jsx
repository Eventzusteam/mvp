import React, { useState } from "react"
import { motion } from "framer-motion"
import { Tag, ChevronDown, ChevronUp } from "lucide-react"

const EventDescription = ({ event }) => {
  const [expanded, setExpanded] = useState(false)
  const { description, tags, category } = event

  // If description is short, don't show expand/collapse
  const isLongDescription = description && description.length > 400
  const displayDescription =
    isLongDescription && !expanded
      ? `${description.substring(0, 400)}...`
      : description

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-2xl font-bold mb-4">About This Event</h2>

      <div className="mb-6">
        <p className="text-gray-700 whitespace-pre-wrap">
          {displayDescription}
        </p>

        {isLongDescription && (
          <button
            className="mt-3 flex items-center text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp
                  size={18}
                  className="mr-1"
                />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown
                  size={18}
                  className="mr-1"
                />
                Read More
              </>
            )}
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
        <div className="flex items-center text-gray-700">
          <Tag
            size={16}
            className="mr-2 text-blue-600"
          />
          <span className="font-medium">Category:</span>
          <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {category}
          </span>
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 sm:ml-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-800 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default EventDescription
