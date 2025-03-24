import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Calendar,
  MapPin,
  Tag,
  DollarSign,
  SortDesc,
} from "lucide-react"
import DateRangePicker from "./DateRangePicker"
import LocationDropdown from "./LocationDropdown"
import CategoryDropdown from "./CategoryDropdown"
import PriceFilter from "./PriceFilter"
import SortByDropdown from "./SortByDropdown"
import { useDebounce } from "../../../../hooks/useDebounce"

const FilterSearch = () => {
  // States for filter values
  const [searchTerm, setSearchTerm] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)

  // Debounced search term to reduce API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Handle scroll to show/hide sticky filter bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  // Toggle filter dropdown visibility
  const toggleFilter = (filterName) => {
    if (activeFilter === filterName) {
      setActiveFilter(null)
      setIsFilterOpen(false)
    } else {
      setActiveFilter(filterName)
      setIsFilterOpen(true)
    }
  }

  // Close all filters
  const closeAllFilters = () => {
    setActiveFilter(null)
    setIsFilterOpen(false)
  }

  // Handle click outside to close filters
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".filter-container") &&
        !e.target.closest(".filter-button")
      ) {
        closeAllFilters()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Apply selected filters
  const applyFilters = (filterData) => {
    console.log("Applying filters:", filterData)
    closeAllFilters()
    // Implementation would depend on your data fetching strategy
  }

  return (
    <motion.div
      className={`w-full bg-white rounded-lg z-50 shadow-lg`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3">
        {/* Mobile Search Bar - Now Disabled */}
        <div className="md:hidden mb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              disabled
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed opacity-70"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Desktop Search - Now Disabled */}
          <div className="hidden md:block flex-grow mr-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                disabled
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed opacity-70"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
            </div>
          </div>

          {/* Filter Buttons - Disabled */}
          <div className="flex flex-wrap gap-2">
            <button
              className={`filter-button flex items-center px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed opacity-70`}
              disabled
            >
              <Calendar
                size={18}
                className="mr-1"
              />
              <span className="hidden sm:inline">Date</span>
            </button>

            <button
              className={`filter-button flex items-center px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed opacity-70`}
              disabled
            >
              <MapPin
                size={18}
                className="mr-1"
              />
              <span className="hidden sm:inline">Location</span>
            </button>

            <button
              className={`filter-button flex items-center px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed opacity-70`}
              disabled
            >
              <Tag
                size={18}
                className="mr-1"
              />
              <span className="hidden sm:inline">Category</span>
            </button>

            <button
              className={`filter-button flex items-center px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed opacity-70`}
              disabled
            >
              <DollarSign
                size={18}
                className="mr-1"
              />
              <span className="hidden sm:inline">Price</span>
            </button>

            <button
              className={`filter-button flex items-center px-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed opacity-70`}
              disabled
            >
              <SortDesc
                size={18}
                className="mr-1"
              />
              <span className="hidden sm:inline">Sort</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              className="filter-container relative mt-2 p-4 bg-white rounded-lg border border-gray-200 shadow-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeFilter === "date" && (
                <DateRangePicker onApply={applyFilters} />
              )}
              {activeFilter === "location" && (
                <LocationDropdown onApply={applyFilters} />
              )}
              {activeFilter === "category" && (
                <CategoryDropdown onApply={applyFilters} />
              )}
              {activeFilter === "price" && (
                <PriceFilter onApply={applyFilters} />
              )}
              {activeFilter === "sort" && (
                <SortByDropdown onApply={applyFilters} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters Display */}
        <div className="mt-3 flex flex-wrap gap-2">
          {/* You can add pills here to show active filters */}
        </div>
      </div>
    </motion.div>
  )
}

export default FilterSearch
