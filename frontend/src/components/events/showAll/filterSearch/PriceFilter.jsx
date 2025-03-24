import React, { useState } from "react"
import { DollarSign } from "lucide-react"
import { motion } from "framer-motion"

const PriceFilter = ({ onApply }) => {
  const [priceType, setPriceType] = useState("all") // 'all', 'free', 'paid'
  const [priceRange, setPriceRange] = useState([0, 500])

  // Handle radio button change
  const handlePriceTypeChange = (type) => {
    setPriceType(type)
    if (type === "free") {
      setPriceRange([0, 0])
    } else if (type === "all") {
      setPriceRange([0, 500])
    }
  }

  // Handle slider change
  const handleRangeChange = (e) => {
    const value = parseInt(e.target.value, 10)
    setPriceRange([0, value])
  }

  // Apply price filter
  const handleApply = () => {
    onApply({
      priceType,
      priceRange:
        priceType === "paid"
          ? priceRange
          : priceType === "free"
          ? [0, 0]
          : [0, 500],
    })
  }

  // Clear selection
  const handleClear = () => {
    setPriceType("all")
    setPriceRange([0, 500])
  }

  return (
    <div className="w-full">
      <div className="mb-3">
        <div className="flex items-center mb-4">
          <DollarSign
            size={18}
            className="mr-2 text-blue-600"
          />
          <h3 className="text-lg font-medium">Price Filter</h3>
        </div>

        {/* Price Type Options */}
        <div className="space-y-2 mb-4">
          <div
            className={`p-3 border rounded-md cursor-pointer ${
              priceType === "all"
                ? "bg-blue-50 border-blue-500"
                : "border-gray-200"
            }`}
            onClick={() => handlePriceTypeChange("all")}
          >
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full border ${
                  priceType === "all" ? "border-blue-600" : "border-gray-400"
                } flex items-center justify-center mr-2`}
              >
                {priceType === "all" && (
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                )}
              </div>
              <div>
                <div className="font-medium">All Prices</div>
                <div className="text-sm text-gray-500">
                  Show events at any price
                </div>
              </div>
            </div>
          </div>

          <div
            className={`p-3 border rounded-md cursor-pointer ${
              priceType === "free"
                ? "bg-blue-50 border-blue-500"
                : "border-gray-200"
            }`}
            onClick={() => handlePriceTypeChange("free")}
          >
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full border ${
                  priceType === "free" ? "border-blue-600" : "border-gray-400"
                } flex items-center justify-center mr-2`}
              >
                {priceType === "free" && (
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                )}
              </div>
              <div>
                <div className="font-medium">Free Only</div>
                <div className="text-sm text-gray-500">
                  Only show free events
                </div>
              </div>
            </div>
          </div>

          <div
            className={`p-3 border rounded-md cursor-pointer ${
              priceType === "paid"
                ? "bg-blue-50 border-blue-500"
                : "border-gray-200"
            }`}
            onClick={() => handlePriceTypeChange("paid")}
          >
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full border ${
                  priceType === "paid" ? "border-blue-600" : "border-gray-400"
                } flex items-center justify-center mr-2`}
              >
                {priceType === "paid" && (
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                )}
              </div>
              <div>
                <div className="font-medium">Paid Only</div>
                <div className="text-sm text-gray-500">
                  Only show paid events
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Range Slider (visible only for paid or all) */}
        {priceType !== "free" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <div className="mb-2">
              <label className="text-sm font-medium">
                Maximum Price: ${priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={priceRange[1]}
                onChange={handleRangeChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>$0</span>
              <span>$250</span>
              <span>$500</span>
              <span>$750</span>
              <span>$1000</span>
            </div>
          </motion.div>
        )}
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
        >
          Apply
        </button>
      </div>
    </div>
  )
}

export default PriceFilter
