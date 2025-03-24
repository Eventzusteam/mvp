import React, { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"

const DateRangePicker = ({ onApply }) => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Get current month and year
  const monthYear = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  })

  // Generate days for the current month view
  const generateDays = () => {
    const days = []
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    // First day of the month
    const firstDay = new Date(year, month, 1)
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)

    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay()

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  // Previous month
  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    )
  }

  // Next month
  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    )
  }

  // Day selection
  const selectDate = (date) => {
    if (!startDate || (startDate && endDate) || date < startDate) {
      setStartDate(date)
      setEndDate(null)
    } else if (date >= startDate) {
      setEndDate(date)
    }
  }

  // Check if a date is selected
  const isSelected = (date) => {
    if (!date) return false
    return (
      (startDate && date.getTime() === startDate.getTime()) ||
      (endDate && date.getTime() === endDate.getTime())
    )
  }

  // Check if date is in range
  const isInRange = (date) => {
    if (!date || !startDate || !endDate) return false
    return date > startDate && date < endDate
  }

  // Format date for display
  const formatDate = (date) => {
    if (!date) return ""
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Apply selected date range
  const handleApply = () => {
    onApply({ startDate, endDate })
  }

  // Clear date range
  const handleClear = () => {
    setStartDate(null)
    setEndDate(null)
  }

  return (
    <div className="w-full">
      <div className="mb-3">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Calendar
              size={18}
              className="mr-2 text-blue-600"
            />
            <h3 className="text-lg font-medium">Select Date Range</h3>
          </div>
          <div className="flex items-center">
            <button
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={prevMonth}
            >
              <ChevronLeft size={20} />
            </button>
            <span className="mx-2 text-sm font-medium">{monthYear}</span>
            <button
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={nextMonth}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, i) => (
            <div
              key={i}
              className="text-center text-xs font-medium py-1"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {generateDays().map((day, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: day ? 1.1 : 1 }}
              className={`
                text-center py-1 rounded-full cursor-pointer text-sm
                ${!day ? "invisible" : ""}
                ${isSelected(day) ? "bg-blue-600 text-white" : ""}
                ${isInRange(day) ? "bg-blue-100" : ""}
              `}
              onClick={() => day && selectDate(day)}
            >
              {day ? day.getDate() : ""}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Selected Range Display */}
      <div className="flex justify-between text-sm mb-4">
        <div>
          <span className="text-gray-500">Start:</span>{" "}
          {formatDate(startDate) || "Not selected"}
        </div>
        <div>
          <span className="text-gray-500">End:</span>{" "}
          {formatDate(endDate) || "Not selected"}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <button
          className="px-3 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
          onClick={handleClear}
        >
          Clear
        </button>
        <button
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={handleApply}
          disabled={!startDate}
        >
          Apply
        </button>
      </div>
    </div>
  )
}

export default DateRangePicker
