import React from "react"
import { FaPlus, FaTrash, FaUser } from "react-icons/fa"

const SpeakersForm = ({
  speakers = [],
  errors = {},
  onSpeakerChange,
  onAddSpeaker,
  onRemoveSpeaker,
}) => {
  return (
    <div className="space-y-6">
      {speakers.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <FaUser className="mx-auto h-10 w-10 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No speakers added
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add speakers to your event
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={onAddSpeaker}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaPlus className="-ml-1 mr-2 h-4 w-4" />
              Add Speaker
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Event Speakers ({speakers.length})
            </h3>
            <button
              type="button"
              onClick={onAddSpeaker}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaPlus className="-ml-0.5 mr-1 h-3 w-3" />
              Add
            </button>
          </div>

          <div className="space-y-6">
            {speakers.map((speaker, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative"
              >
                <button
                  type="button"
                  onClick={() => onRemoveSpeaker(index)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 focus:outline-none"
                  title="Remove speaker"
                >
                  <FaTrash className="h-4 w-4" />
                </button>

                <h4 className="text-sm font-medium text-gray-500 mb-4">
                  Speaker #{index + 1}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor={`speaker-name-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name *
                    </label>
                    <input
                      type="text"
                      id={`speaker-name-${index}`}
                      value={speaker.name || ""}
                      onChange={(e) =>
                        onSpeakerChange(index, "name", e.target.value)
                      }
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Speaker name"
                    />
                    {errors[`speakers.${index}.name`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[`speakers.${index}.name`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`speaker-title-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title/Role
                    </label>
                    <input
                      type="text"
                      id={`speaker-title-${index}`}
                      value={speaker.title || ""}
                      onChange={(e) =>
                        onSpeakerChange(index, "title", e.target.value)
                      }
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Speaker title or role"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor={`speaker-bio-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Bio
                  </label>
                  <textarea
                    id={`speaker-bio-${index}`}
                    rows={3}
                    value={speaker.bio || ""}
                    onChange={(e) =>
                      onSpeakerChange(index, "bio", e.target.value)
                    }
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Speaker biography"
                  />
                </div>

                <div className="mt-4">
                  <label
                    htmlFor={`speaker-photo-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Photo URL
                  </label>
                  <input
                    type="text"
                    id={`speaker-photo-${index}`}
                    value={speaker.photoUrl || ""}
                    onChange={(e) =>
                      onSpeakerChange(index, "photoUrl", e.target.value)
                    }
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="URL to speaker's photo"
                  />

                  {speaker.photoUrl && (
                    <div className="mt-2 flex items-center">
                      <img
                        src={speaker.photoUrl}
                        alt={speaker.name || "Speaker"}
                        className="h-16 w-16 rounded-full object-cover border border-gray-300"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/150?text=Speaker"
                        }}
                      />
                      <span className="ml-3 text-xs text-gray-500">
                        Photo preview
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default SpeakersForm
