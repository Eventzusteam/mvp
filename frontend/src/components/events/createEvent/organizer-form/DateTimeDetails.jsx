import React from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, AlertCircle } from "lucide-react"

const DateTimeDetails = ({ formData, updateFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    updateFormData("dateTime", { [name]: value })
  }

  // List of common timezones
  const timezones = [
    { value: "UTC", label: "UTC - Coordinated Universal Time" },
    {
      value: "America/New_York",
      label: "EST - Eastern Standard Time (US & Canada)",
    },
    {
      value: "America/Chicago",
      label: "CST - Central Standard Time (US & Canada)",
    },
    {
      value: "America/Denver",
      label: "MST - Mountain Standard Time (US & Canada)",
    },
    {
      value: "America/Los_Angeles",
      label: "PST - Pacific Standard Time (US & Canada)",
    },
    { value: "Europe/London", label: "GMT - Greenwich Mean Time" },
    { value: "Europe/Paris", label: "CET - Central European Time" },
    { value: "Asia/Tokyo", label: "JST - Japan Standard Time" },
    { value: "Asia/Shanghai", label: "CST - China Standard Time" },
    {
      value: "Australia/Sydney",
      label: "AEST - Australian Eastern Standard Time",
    },
    { value: "Asia/Kolkata", label: "IST - India Standard Time" },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">Date & Time</h3>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start">
            <AlertCircle
              className="text-blue-500 mt-0.5 mr-3 flex-shrink-0"
              size={18}
            />
            <p className="text-sm text-blue-700">
              All dates and times will be displayed to attendees in their local
              timezone. Make sure to set the correct timezone for your event.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 flex items-center"
              >
                <Calendar
                  size={16}
                  className="mr-1"
                />{" "}
                Start Date*
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 flex items-center"
              >
                <Calendar
                  size={16}
                  className="mr-1"
                />{" "}
                End Date*
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startTime"
                className="block text-sm font-medium text-gray-700 flex items-center"
              >
                <Clock
                  size={16}
                  className="mr-1"
                />{" "}
                Start Time*
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="endTime"
                className="block text-sm font-medium text-gray-700 flex items-center"
              >
                <Clock
                  size={16}
                  className="mr-1"
                />{" "}
                End Time*
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="timezone"
              className="block text-sm font-medium text-gray-700"
            >
              Timezone*
            </label>
            <select
              id="timezone"
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              {timezones.map((tz) => (
                <option
                  key={tz.value}
                  value={tz.value}
                >
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="registrationDeadline"
              className="block text-sm font-medium text-gray-700"
            >
              Registration Deadline (Optional)
            </label>
            <input
              type="datetime-local"
              id="registrationDeadline"
              name="registrationDeadline"
              value={formData.registrationDeadline}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              If left blank, registration will be available until the event
              starts
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default DateTimeDetails
