import React from "react"
import { motion } from "framer-motion"
import {
  Columns2,
  Columns3,
  Grid,
  List,
  LayoutGrid,
  Square,
  PanelTop,
} from "lucide-react"

const LayoutControls = ({
  currentLayout,
  onLayoutChange,
  viewMode,
  onViewModeChange,
  cardSize,
  onCardSizeChange,
}) => {
  const layouts = [
    { id: 2, icon: Columns2, label: "2 columns" },
    { id: 3, icon: Columns3, label: "3 columns" },
    { id: 4, icon: Grid, label: "4 columns" },
  ]

  const viewModes = [
    { id: "grid", icon: LayoutGrid, label: "Grid view" },
    { id: "list", icon: List, label: "List view" },
  ]

  const cardSizes = [
    { id: "compact", icon: Square, label: "Compact cards" },
    { id: "normal", icon: PanelTop, label: "Normal cards" },
  ]

  return (
    <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
      <div className="flex items-center gap-4">
        {/* View Mode Toggle */}
        <div className="flex items-center">
          <span className="text-gray-600 mr-2 text-sm hidden sm:inline">
            View:
          </span>
          <div className="flex gap-2">
            {viewModes.map((mode) => {
              const Icon = mode.icon
              return (
                <motion.button
                  key={mode.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-md transition-colors duration-300 ${
                    viewMode === mode.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => onViewModeChange(mode.id)}
                  aria-label={mode.label}
                  title={mode.label}
                >
                  <Icon size={18} />
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Card Size Toggle */}
        <div className="flex items-center">
          <span className="text-gray-600 mr-2 text-sm hidden sm:inline">
            Size:
          </span>
          <div className="flex gap-2">
            {cardSizes.map((size) => {
              const Icon = size.icon
              return (
                <motion.button
                  key={size.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-md transition-colors duration-300 ${
                    cardSize === size.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => onCardSizeChange(size.id)}
                  aria-label={size.label}
                  title={size.label}
                >
                  <Icon size={18} />
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Grid Column Layout (Only show in grid view) */}
      {viewMode === "grid" && (
        <div className="flex items-center">
          <span className="text-gray-600 mr-2 text-sm hidden sm:inline">
            Columns:
          </span>
          <div className="flex gap-2">
            {layouts.map((layout) => {
              const Icon = layout.icon
              return (
                <motion.button
                  key={layout.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-md transition-colors duration-300 ${
                    currentLayout === layout.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => onLayoutChange(layout.id)}
                  aria-label={layout.label}
                  title={layout.label}
                >
                  <Icon size={18} />
                </motion.button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default LayoutControls
