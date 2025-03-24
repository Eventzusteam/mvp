import React, { useState } from "react"
import { MapPin, Search } from "lucide-react"

const LocationDropdown = ({ onApply }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState(null)

  // Example locations - in production, this would be populated from an API
  const locations = [
    { id: 1, name: "New York, NY", popular: true },
    { id: 2, name: "Los Angeles, CA", popular: true },
    { id: 3, name: "Chicago, IL", popular: true },
    { id: 4, name: "San Francisco, CA", popular: true },
    { id: 5, name: "Miami, FL", popular: true },
    { id: 6, name: "Austin, TX", popular: false },
    { id: 7, name: "Boston, MA", popular: false },
    { id: 8, name: "Denver, CO", popular: false },
    { id: 9, name: "Seattle, WA", popular: false },
    { id: 10, name: "Nashville, TN", popular: false },
  ]

  // Filter locations based on search
  const filteredLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Group locations by popularity
  const popularLocations = filteredLocations.filter((loc) => loc.popular)
  const otherLocations = filteredLocations.filter((loc) => !loc.popular)

  // Select location
  const handleSelectLocation = (location) => {
    setSelectedLocation(location)
  }

  // Apply selected location
  const handleApply = () => {
    onApply({ location: selectedLocation })
  }

  // Clear selection
  const handleClear = () => {
    setSelectedLocation(null)
    setSearchTerm("")
  }

  return (
    <div className="w-full">
      <div className="mb-3">
        <div className="flex items-center mb-4">
          <MapPin
            size={18}
            className="mr-2 text-blue-600"
          />
          <h3 className="text-lg font-medium">Select Location</h3>
        </div>

        {/* Search Box */}
        <div className="relative mb-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search locations..."
            className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search
            className="absolute left-3 top-2.5 text-gray-400"
            size={20}
          />
        </div>

        {/* Locations List */}
        <div className="max-h-60 overflow-y-auto">
          {popularLocations.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Popular Locations
              </h4>
              <div className="space-y-1">
                {popularLocations.map((location) => (
                  <div
                    key={location.id}
                    className={`px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                      selectedLocation?.id === location.id
                        ? "bg-blue-50 text-blue-600"
                        : ""
                    }`}
                    onClick={() => handleSelectLocation(location)}
                  >
                    <div className="flex items-center">
                      <MapPin
                        size={16}
                        className="mr-2 text-gray-400"
                      />
                      <span>{location.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {otherLocations.length > 0 && (
            <div>
              {popularLocations.length > 0 && (
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Other Locations
                </h4>
              )}
              <div className="space-y-1">
                {otherLocations.map((location) => (
                  <div
                    key={location.id}
                    className={`px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                      selectedLocation?.id === location.id
                        ? "bg-blue-50 text-blue-600"
                        : ""
                    }`}
                    onClick={() => handleSelectLocation(location)}
                  >
                    <div className="flex items-center">
                      <MapPin
                        size={16}
                        className="mr-2 text-gray-400"
                      />
                      <span>{location.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredLocations.length === 0 && (
            <div className="py-3 text-center text-gray-500">
              No locations found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>

      {/* Selected Location Display */}
      {selectedLocation && (
        <div className="mb-3 p-2 bg-blue-50 rounded-md">
          <div className="flex items-center text-blue-600">
            <MapPin
              size={16}
              className="mr-2"
            />
            <span className="font-medium">{selectedLocation.name}</span>
          </div>
        </div>
      )}

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
          disabled={!selectedLocation}
        >
          Apply
        </button>
      </div>
    </div>
  )
}

export default LocationDropdown
