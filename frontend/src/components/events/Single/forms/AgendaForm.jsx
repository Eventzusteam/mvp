import React from "react"
import { FaPlus, FaTrash, FaClock, FaCalendarDay } from "react-icons/fa"

const AgendaForm = ({
  agenda = [],
  errors = {},
  onAgendaItemChange,
  onAddAgendaItem,
  onRemoveAgendaItem,
}) => {
  return (
    <div className="space-y-6">
      {agenda.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <FaCalendarDay className="mx-auto h-10 w-10 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No agenda items added
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Create your event schedule by adding agenda items
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={onAddAgendaItem}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaPlus className="-ml-1 mr-2 h-4 w-4" />
              Add Agenda Item
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Event Schedule ({agenda.length} items)
            </h3>
            <button
              type="button"
              onClick={onAddAgendaItem}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaPlus className="-ml-0.5 mr-1 h-3 w-3" />
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {agenda.map((item, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative"
              >
                <button
                  type="button"
                  onClick={() => onRemoveAgendaItem(index)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 focus:outline-none"
                  title="Remove agenda item"
                >
                  <FaTrash className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor={`agenda-time-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Time
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaClock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id={`agenda-time-${index}`}
                        value={item.time || ""}
                        onChange={(e) =>
                          onAgendaItemChange(index, "time", e.target.value)
                        }
                        className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        placeholder="e.g. 9:00 AM - 10:30 AM"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={`agenda-title-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id={`agenda-title-${index}`}
                      value={item.title || ""}
                      onChange={(e) =>
                        onAgendaItemChange(index, "title", e.target.value)
                      }
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Session title"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor={`agenda-description-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id={`agenda-description-${index}`}
                    rows={2}
                    value={item.description || ""}
                    onChange={(e) =>
                      onAgendaItemChange(index, "description", e.target.value)
                    }
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Brief description of this session"
                  />
                </div>

                <div className="mt-4">
                  <label
                    htmlFor={`agenda-speaker-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Speaker
                  </label>
                  <input
                    type="text"
                    id={`agenda-speaker-${index}`}
                    value={item.speaker || ""}
                    onChange={(e) =>
                      onAgendaItemChange(index, "speaker", e.target.value)
                    }
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Name of speaker or presenter"
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default AgendaForm
