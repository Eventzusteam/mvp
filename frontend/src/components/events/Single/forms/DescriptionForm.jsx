import React from "react"
import { FaPlus, FaTrash, FaListUl } from "react-icons/fa"

const DescriptionForm = ({
  formData,
  errors,
  onChange,
  onHighlightChange,
  onAddHighlight,
  onRemoveHighlight,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Event Description *
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            name="description"
            rows={6}
            value={formData.description || ""}
            onChange={onChange}
            className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
              errors.description ? "border-red-300" : ""
            }`}
            placeholder="Provide a detailed description of your event..."
          />
        </div>
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
        <p className="mt-2 text-sm text-gray-500">
          Write a compelling description that explains what attendees can expect
          from your event. You can include information about topics covered,
          what attendees will learn, and why they should attend.
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Event Highlights
          </label>
          <button
            type="button"
            onClick={onAddHighlight}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaPlus className="-ml-0.5 mr-1 h-3 w-3" />
            Add Highlight
          </button>
        </div>

        {formData.highlights && formData.highlights.length > 0 ? (
          <div className="space-y-3">
            {formData.highlights.map((highlight, index) => (
              <div
                key={index}
                className="flex items-start group"
              >
                <div className="mt-2 mr-2 text-blue-500">
                  <FaListUl className="h-4 w-4" />
                </div>
                <div className="flex-grow">
                  <input
                    type="text"
                    value={highlight.text || ""}
                    onChange={(e) => onHighlightChange(index, e.target.value)}
                    className="block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter a key highlight of your event"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveHighlight(index)}
                  className="mt-2 ml-2 text-red-400 hover:text-red-600 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTrash className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <FaListUl className="mx-auto h-8 w-8 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No highlights added
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Add key points about your event to attract attendees
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={onAddHighlight}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaPlus className="-ml-1 mr-2 h-4 w-4" />
                Add Event Highlight
              </button>
            </div>
          </div>
        )}
        <p className="mt-2 text-sm text-gray-500">
          Highlights should be concise bullet points that summarize key aspects
          of your event.
        </p>
      </div>
    </div>
  )
}

export default DescriptionForm
