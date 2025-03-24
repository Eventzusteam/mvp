import React from "react"
import { FaCalendarAlt, FaFolder, FaImage } from "react-icons/fa"

const BasicInfoForm = ({ formData, errors, onChange }) => {
  const categories = [
    "Conference",
    "Workshop",
    "Seminar",
    "Webinar",
    "Meetup",
    "Networking",
    "Trade Show",
    "Exhibition",
    "Concert",
    "Festival",
    "Fundraiser",
    "Corporate Event",
    "Other",
  ]

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Event Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title || ""}
          onChange={onChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors.title ? "border-red-300" : ""
          }`}
          placeholder="Enter event title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category *
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaFolder className="h-4 w-4 text-gray-400" />
          </div>
          <select
            id="category"
            name="category"
            value={formData.category || ""}
            onChange={onChange}
            className={`pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.category ? "border-red-300" : ""
            }`}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date & Time *
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCalendarAlt className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={formData.startDate || ""}
              onChange={onChange}
              className={`pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.startDate ? "border-red-300" : ""
              }`}
            />
          </div>
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700"
          >
            End Date & Time
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCalendarAlt className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={formData.endDate || ""}
              onChange={onChange}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="bannerImage"
          className="block text-sm font-medium text-gray-700"
        >
          Banner Image URL
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaImage className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            id="bannerImage"
            name="bannerImage"
            value={formData.bannerImage || ""}
            onChange={onChange}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Enter image URL"
          />
        </div>
        {formData.bannerImage && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Preview:</p>
            <img
              src={formData.bannerImage}
              alt="Banner preview"
              className="h-32 w-full object-cover rounded-md border border-gray-300"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/800x400?text=Image+Not+Found"
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default BasicInfoForm
