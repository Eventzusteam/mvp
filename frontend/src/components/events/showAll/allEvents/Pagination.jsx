import React from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []

    // Always show first page
    if (currentPage > 3) {
      pages.push(1)
      if (currentPage > 4) {
        pages.push("...")
      }
    }

    // Show current page and surrounding pages
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages, currentPage + 1);
      i++
    ) {
      pages.push(i)
    }

    // Always show last page
    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) {
        pages.push("...")
      }
      pages.push(totalPages)
    }

    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center mt-8 gap-2">
      <motion.button
        whileHover={{ x: -2 }}
        whileTap={{ scale: 0.95 }}
        className={`p-2 rounded-md ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </motion.button>

      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2"
          >
            ...
          </span>
        ) : (
          <motion.button
            key={`page-${page}`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors duration-300 ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </motion.button>
        )
      )}

      <motion.button
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.95 }}
        className={`p-2 rounded-md ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </motion.button>
    </div>
  )
}

export default Pagination
