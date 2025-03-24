import React from "react"
import { FaMapMarkerAlt, FaBuilding, FaGlobe, FaLink } from "react-icons/fa"

const InformationForm = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <div className="flex items-center mr-6">
          <input
            id="isVirtual"
            name="isVirtual"
            type="checkbox"
            checked={formData.isVirtual || false}
            onChange={onChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isVirtual"
            className="ml-2 block text-sm text-gray-700"
          >
            Virtual Event
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="isHybrid"
            name="isHybrid"
            type="checkbox"
            checked={formData.isHybrid || false}
            onChange={onChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isHybrid"
            className="ml-2 block text-sm text-gray-700"
          >
            Hybrid Event
          </label>
        </div>
      </div>

      {(formData.isVirtual || formData.isHybrid) && (
        <div>
          <label
            htmlFor="virtualLink"
            className="block text-sm font-medium text-gray-700"
          >
            Virtual Event Link
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLink className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              id="virtualLink"
              name="virtualLink"
              value={formData.virtualLink || ""}
              onChange={onChange}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="https://zoom.us/j/example or similar"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Provide the link for attendees to join virtually.
          </p>
        </div>
      )}

      {(!formData.isVirtual || formData.isHybrid) && (
        <>
          <div>
            <label
              htmlFor="venue"
              className="block text-sm font-medium text-gray-700"
            >
              Venue Name
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaBuilding className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="venue"
                name="venue"
                value={formData.venue || ""}
                onChange={onChange}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter venue name"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Street Address
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={onChange}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter street address"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city || ""}
                onChange={onChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="City"
              />
            </div>
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700"
              >
                State/Province
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state || ""}
                onChange={onChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="State/Province"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium text-gray-700"
              >
                ZIP/Postal Code
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode || ""}
                onChange={onChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="ZIP/Postal Code"
              />
            </div>
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaGlobe className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country || ""}
                  onChange={onChange}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Country"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default InformationForm
