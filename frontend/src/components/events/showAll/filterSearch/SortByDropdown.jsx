import React, { useState } from "react"
import { SortDesc, Clock, TrendingUp, Trophy } from "lucide-react"

const SortByDropdown = ({ onApply }) => {
  const [selectedSort, setSelectedSort] = useState(null)

  // Sort options
  const sortOptions = [
    {
      id: "newest",
      name: "Newest First",
      icon: <Clock size={16} />,
      description: "Recently added events",
    },
    {
      id: "popular",
      name: "Most Popular",
      icon: <Trophy size={16} />,
      description: "Events with highest attendance",
    },
    {
      id: "trending",
      name: "Trending",
      icon: <TrendingUp size={16} />,
      description: "Fast-growing events",
    },
  ]

  // Select sort option
  const handleSelectSort = (option) => {
    setSelectedSort(option)
  }

  // Apply selected sort
  const handleApply = () => {
    if (selectedSort) {
      onApply({ sort: selectedSort })
    }
  }

  // Clear selection
  const handleClear = () => {
    setSelectedSort(null)
  }

  return (
    <div className="w-full">
      <div className="mb-3">
        <div className="flex items-center mb-4">
          <SortDesc
            size={18}
            className="mr-2 text-blue-600"
          />
          <h3 className="text-lg font-medium">Sort Results</h3>
        </div>

        {/* Sort Options */}
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <div
              key={option.id}
              className={`p-3 border rounded-md cursor-pointer ${
                selectedSort?.id === option.id
                  ? "bg-blue-50 border-blue-500"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleSelectSort(option)}
            >
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full border ${
                    selectedSort?.id === option.id
                      ? "border-blue-600"
                      : "border-gray-400"
                  } flex items-center justify-center mr-2`}
                >
                  {selectedSort?.id === option.id && (
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-gray-500">{option.icon}</span>
                  <div>
                    <div className="font-medium">{option.name}</div>
                    <div className="text-sm text-gray-500">
                      {option.description}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
          disabled={!selectedSort}
        >
          Apply
        </button>
      </div>
    </div>
  )
}

export default SortByDropdown
