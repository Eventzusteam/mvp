import React, { useState } from "react"
import { Tag, Check } from "lucide-react"

const CategoryDropdown = ({ onApply }) => {
  const [selectedCategories, setSelectedCategories] = useState([])

  // Example categories
  const categories = [
    { id: 1, name: "Tech", icon: "💻" },
    { id: 2, name: "Music", icon: "🎵" },
    { id: 3, name: "Business", icon: "💼" },
    { id: 4, name: "Art", icon: "🎨" },
    { id: 5, name: "Food", icon: "🍔" },
    { id: 6, name: "Sports", icon: "⚽" },
    { id: 7, name: "Health", icon: "🏥" },
    { id: 8, name: "Education", icon: "📚" },
  ]

  // Toggle category selection
  const toggleCategory = (category) => {
    setSelectedCategories((prev) => {
      if (prev.find((cat) => cat.id === category.id)) {
        return prev.filter((cat) => cat.id !== category.id)
      } else {
        return [...prev, category]
      }
    })
  }

  // Apply selected categories
  const handleApply = () => {
    onApply({ categories: selectedCategories })
  }

  // Clear selection
  const handleClear = () => {
    setSelectedCategories([])
  }

  // Check if category is selected
  const isSelected = (category) => {
    return selectedCategories.some((cat) => cat.id === category.id)
  }

  return (
    <div className="w-full">
      <div className="mb-3">
        <div className="flex items-center mb-4">
          <Tag
            size={18}
            className="mr-2 text-blue-600"
          />
          <h3 className="text-lg font-medium">Select Categories</h3>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`
                flex items-center p-2 rounded-md cursor-pointer border
                ${
                  isSelected(category)
                    ? "bg-blue-50 border-blue-500"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
              onClick={() => toggleCategory(category)}
            >
              <div className="flex items-center flex-1">
                <span className="mr-2">{category.icon}</span>
                <span>{category.name}</span>
              </div>
              {isSelected(category) && (
                <Check
                  size={16}
                  className="text-blue-600"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Categories */}
      {selectedCategories.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Selected
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <div
                key={category.id}
                className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm flex items-center"
              >
                <span className="mr-1">{category.icon}</span>
                <span>{category.name}</span>
              </div>
            ))}
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
          disabled={selectedCategories.length === 0}
        >
          Apply
        </button>
      </div>
    </div>
  )
}

export default CategoryDropdown
