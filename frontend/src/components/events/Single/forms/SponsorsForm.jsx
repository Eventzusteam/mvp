import React from "react"
import { FaPlus, FaTrash, FaHandshake, FaLink } from "react-icons/fa"

const SponsorsForm = ({
  sponsors = [],
  errors = {},
  onSponsorChange,
  onAddSponsor,
  onRemoveSponsor,
}) => {
  const sponsorLevels = [
    { value: "platinum", label: "Platinum" },
    { value: "gold", label: "Gold" },
    { value: "silver", label: "Silver" },
    { value: "bronze", label: "Bronze" },
    { value: "partner", label: "Partner" },
    { value: "media", label: "Media Partner" },
    { value: "other", label: "Other" },
  ]

  return (
    <div className="space-y-6">
      {sponsors.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <FaHandshake className="mx-auto h-10 w-10 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No sponsors added
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add sponsors to showcase event partnerships
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={onAddSponsor}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaPlus className="-ml-1 mr-2 h-4 w-4" />
              Add Sponsor
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Event Sponsors ({sponsors.length})
            </h3>
            <button
              type="button"
              onClick={onAddSponsor}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaPlus className="-ml-0.5 mr-1 h-3 w-3" />
              Add
            </button>
          </div>

          <div className="space-y-4">
            {sponsors.map((sponsor, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative"
              >
                <button
                  type="button"
                  onClick={() => onRemoveSponsor(index)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 focus:outline-none"
                  title="Remove sponsor"
                >
                  <FaTrash className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor={`sponsor-name-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id={`sponsor-name-${index}`}
                      value={sponsor.name || ""}
                      onChange={(e) =>
                        onSponsorChange(index, "name", e.target.value)
                      }
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Sponsor name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`sponsor-level-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Sponsorship Level
                    </label>
                    <select
                      id={`sponsor-level-${index}`}
                      value={sponsor.level || "gold"}
                      onChange={(e) =>
                        onSponsorChange(index, "level", e.target.value)
                      }
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      {sponsorLevels.map((level) => (
                        <option
                          key={level.value}
                          value={level.value}
                        >
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor={`sponsor-logo-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Logo URL
                  </label>
                  <input
                    type="text"
                    id={`sponsor-logo-${index}`}
                    value={sponsor.logo || ""}
                    onChange={(e) =>
                      onSponsorChange(index, "logo", e.target.value)
                    }
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="URL to sponsor's logo"
                  />

                  {sponsor.logo && (
                    <div className="mt-2 flex items-center">
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name || "Sponsor"}
                        className="h-12 object-contain border border-gray-300 rounded p-1"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/200x80?text=Logo"
                        }}
                      />
                      <span className="ml-3 text-xs text-gray-500">
                        Logo preview
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <label
                    htmlFor={`sponsor-website-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Website
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLink className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id={`sponsor-website-${index}`}
                      value={sponsor.website || ""}
                      onChange={(e) =>
                        onSponsorChange(index, "website", e.target.value)
                      }
                      className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default SponsorsForm
