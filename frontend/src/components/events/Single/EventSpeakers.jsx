import React from "react"
import { motion } from "framer-motion"
import { Users, Globe } from "lucide-react"

const EventSpeakers = ({ speakers }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-2xl font-bold mb-4">Speakers</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {speakers.map((speaker, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="flex bg-gray-50 p-4 rounded-lg"
          >
            <div className="flex-shrink-0 mr-4">
              {speaker.photo ? (
                <img
                  src={
                    typeof speaker.photo === "string"
                      ? speaker.photo
                      : URL.createObjectURL(speaker.photo)
                  }
                  alt={speaker.name}
                  className="w-20 h-20 object-cover rounded-full border-2 border-blue-100"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Users size={32} />
                </div>
              )}
            </div>

            <div>
              <h3 className="font-bold text-lg">{speaker.name}</h3>
              {speaker.title && (
                <p className="text-sm text-gray-600">{speaker.title}</p>
              )}
              {speaker.company && (
                <p className="text-sm text-gray-600">{speaker.company}</p>
              )}
              {speaker.bio && (
                <p className="text-sm text-gray-700 mt-2">{speaker.bio}</p>
              )}
              {speaker.website && (
                <a
                  href={speaker.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm flex items-center mt-2 hover:underline"
                >
                  <Globe
                    size={14}
                    className="mr-1"
                  />{" "}
                  Website
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default EventSpeakers
