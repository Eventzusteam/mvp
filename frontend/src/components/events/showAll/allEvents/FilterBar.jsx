import React from "react"
import { motion } from "framer-motion"

const categories = [
  { id: "all", name: "All Events" },
  { id: "conference", name: "Conferences" },
  { id: "workshop", name: "Workshops" },
  { id: "concert", name: "Concerts" },
  { id: "exhibition", name: "Exhibitions" },
  { id: "networking", name: "Networking" },
]

const FilterBar = ({ filter, onFilterChange }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-4">
      {categories.map((category) => (
        <motion.button
          key={category.id}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-colors duration-300 ${
            filter === category.id
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => onFilterChange(category.id)}
        >
          {category.name}
        </motion.button>
      ))}
    </div>
  )
}

export default FilterBar
