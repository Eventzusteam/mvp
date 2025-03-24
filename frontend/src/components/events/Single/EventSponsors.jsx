import React from "react"
import { motion } from "framer-motion"
import { Globe, Award } from "lucide-react"

const EventSponsors = ({ sponsors }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Award
          size={24}
          className="mr-2 text-blue-600"
        />
        Sponsors
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sponsors.map((sponsor, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col items-center text-center"
          >
            {sponsor.logo ? (
              <img
                src={
                  typeof sponsor.logo === "string"
                    ? sponsor.logo
                    : URL.createObjectURL(sponsor.logo)
                }
                alt={sponsor.name}
                className="h-16 object-contain mb-3"
              />
            ) : (
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-blue-700 font-bold text-lg">
                  {sponsor.name.charAt(0)}
                </span>
              </div>
            )}

            <h3 className="font-bold">{sponsor.name}</h3>
            {sponsor.level && (
              <span className="text-sm text-gray-600">{sponsor.level}</span>
            )}
            {sponsor.website && (
              <a
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm flex items-center mt-2 hover:underline"
              >
                <Globe
                  size={14}
                  className="mr-1"
                />
                Visit Website
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default EventSponsors
