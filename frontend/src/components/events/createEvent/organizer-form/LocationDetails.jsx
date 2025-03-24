import React from "react"
import { motion } from "framer-motion"
import { MapPin, Globe } from "lucide-react"

const LocationDetails = ({ formData, updateFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    updateFormData("location", { [name]: value })
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Location Details
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type*
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="locationType"
                  value="physical"
                  checked={formData.locationType === "physical"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 flex items-center text-sm text-gray-700">
                  <MapPin
                    size={18}
                    className="mr-1 text-gray-500"
                  />{" "}
                  Physical Venue
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="locationType"
                  value="online"
                  checked={formData.locationType === "online"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 flex items-center text-sm text-gray-700">
                  <Globe
                    size={18}
                    className="mr-1 text-gray-500"
                  />{" "}
                  Online Event
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="locationType"
                  value="hybrid"
                  checked={formData.locationType === "hybrid"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Hybrid</span>
              </label>
            </div>
          </div>

          {(formData.locationType === "physical" ||
            formData.locationType === "hybrid") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="venue"
                  className="block text-sm font-medium text-gray-700"
                >
                  Venue Name*
                </label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="e.g. Grand Hotel Conference Center"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required={formData.locationType !== "online"}
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Street Address*
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. 123 Main Street"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required={formData.locationType !== "online"}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City*
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required={formData.locationType !== "online"}
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State/Province*
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required={formData.locationType !== "online"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ZIP/Postal Code*
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required={formData.locationType !== "online"}
                  />
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country*
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required={formData.locationType !== "online"}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {(formData.locationType === "online" ||
            formData.locationType === "hybrid") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <label
                  htmlFor="onlineLink"
                  className="block text-sm font-medium text-gray-700"
                >
                  Online Event Link*
                </label>
                <input
                  type="url"
                  id="onlineLink"
                  name="onlineLink"
                  value={formData.onlineLink}
                  onChange={handleChange}
                  placeholder="e.g. https://zoom.us/j/1234567890"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required={formData.locationType !== "physical"}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Provide the URL for your virtual event (Zoom, Google Meet,
                  YouTube Live, etc.)
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default LocationDetails
