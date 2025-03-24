import React, { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, User, ChevronDown, ChevronUp } from "lucide-react"

const EventAgenda = ({ agenda }) => {
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
      transition={{ duration: 0.4, delay: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-2xl font-bold mb-4">Event Agenda</h2>

      <div className="space-y-4">
        {agenda.map((item, index) => {
          const isExpanded = expandedItems[index]
          const hasLongDescription =
            item.description && item.description.length > 100

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-bold text-lg">{item.title}</h3>
                {item.time && (
                  <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    <Clock
                      size={14}
                      className="mr-1"
                    />
                    {item.time}
                  </div>
                )}
              </div>

              {item.speaker && (
                <div className="flex items-center text-gray-700 mt-2">
                  <User
                    size={14}
                    className="mr-1 text-blue-600"
                  />
                  <span>{item.speaker}</span>
                </div>
              )}

              {item.description && (
                <div className="mt-2">
                  <p className="text-gray-700">
                    {hasLongDescription && !isExpanded
                      ? `${item.description.substring(0, 100)}...`
                      : item.description}
                  </p>

                  {hasLongDescription && (
                    <button
                      onClick={() => toggleItem(index)}
                      className="text-blue-600 text-sm flex items-center mt-1 hover:underline"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp
                            size={14}
                            className="mr-1"
                          />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown
                            size={14}
                            className="mr-1"
                          />
                          Read More
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default EventAgenda
