import React from "react"
import {
  FaCalendarAlt,
  FaUsers,
  FaDollarSign,
  FaPlus,
  FaTrash,
  FaCheck,
} from "react-icons/fa"

const RegistrationForm = ({
  formData,
  errors,
  onChange,
  onTicketTypeChange,
  onAddTicketType,
  onRemoveTicketType,
  onFieldChange,
  onAddField,
  onRemoveField,
}) => {
  const fieldTypes = ["text", "email", "number", "select", "checkbox", "date"]

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-base font-medium text-gray-900">
          Registration Settings
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Configure how attendees will register for your event
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Registration Type
        </label>
        <div className="mt-2 space-y-2">
          <div className="flex items-center">
            <input
              id="free"
              name="registrationType"
              type="radio"
              value="free"
              checked={formData.registrationType === "free"}
              onChange={onChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label
              htmlFor="free"
              className="ml-3 block text-sm text-gray-700"
            >
              Free Event
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="paid"
              name="registrationType"
              type="radio"
              value="paid"
              checked={formData.registrationType === "paid"}
              onChange={onChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label
              htmlFor="paid"
              className="ml-3 block text-sm text-gray-700"
            >
              Paid Event
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="donation"
              name="registrationType"
              type="radio"
              value="donation"
              checked={formData.registrationType === "donation"}
              onChange={onChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label
              htmlFor="donation"
              className="ml-3 block text-sm text-gray-700"
            >
              Donation-based
            </label>
          </div>
        </div>
      </div>

      {formData.registrationType === "paid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Base Price *
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaDollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                step="0.01"
                value={formData.price || 0}
                onChange={onChange}
                className={`pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.price ? "border-red-300" : ""
                }`}
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-gray-700"
            >
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency || "USD"}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="maxAttendees"
            className="block text-sm font-medium text-gray-700"
          >
            Maximum Attendees
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUsers className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="number"
              id="maxAttendees"
              name="maxAttendees"
              min="0"
              value={formData.maxAttendees || 0}
              onChange={onChange}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="0 = unlimited"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Set to 0 for unlimited attendees
          </p>
        </div>
        <div>
          <label
            htmlFor="registrationDeadline"
            className="block text-sm font-medium text-gray-700"
          >
            Registration Deadline
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCalendarAlt className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="datetime-local"
              id="registrationDeadline"
              name="registrationDeadline"
              value={formData.registrationDeadline || ""}
              onChange={onChange}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {formData.registrationType === "paid" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-900">Ticket Types</h3>
            <button
              type="button"
              onClick={onAddTicketType}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaPlus className="-ml-0.5 mr-1 h-3 w-3" />
              Add Ticket Type
            </button>
          </div>

          {formData.ticketTypes && formData.ticketTypes.length > 0 ? (
            <div className="space-y-4 mt-3">
              {formData.ticketTypes.map((ticket, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative group"
                >
                  <button
                    type="button"
                    onClick={() => onRemoveTicketType(index)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>

                  <div className="mb-3">
                    <label
                      htmlFor={`ticket-name-${index}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Ticket Name
                    </label>
                    <input
                      type="text"
                      id={`ticket-name-${index}`}
                      value={ticket.name || ""}
                      onChange={(e) =>
                        onTicketTypeChange(index, "name", e.target.value)
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="E.g. Early Bird, VIP, Standard"
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor={`ticket-description-${index}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description
                    </label>
                    <input
                      type="text"
                      id={`ticket-description-${index}`}
                      value={ticket.description || ""}
                      onChange={(e) =>
                        onTicketTypeChange(index, "description", e.target.value)
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Describe what's included in this ticket"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor={`ticket-price-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Price
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaDollarSign className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id={`ticket-price-${index}`}
                          min="0"
                          step="0.01"
                          value={ticket.price || 0}
                          onChange={(e) =>
                            onTicketTypeChange(
                              index,
                              "price",
                              parseFloat(e.target.value)
                            )
                          }
                          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor={`ticket-quantity-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Quantity
                      </label>
                      <input
                        type="number"
                        id={`ticket-quantity-${index}`}
                        min="0"
                        value={ticket.quantity || 0}
                        onChange={(e) =>
                          onTicketTypeChange(
                            index,
                            "quantity",
                            parseInt(e.target.value)
                          )
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="0 = unlimited"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <FaDollarSign className="mx-auto h-8 w-8 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No ticket types added
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Add different ticket options for your event
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={onAddTicketType}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaPlus className="-ml-1 mr-2 h-4 w-4" />
                  Add Ticket Type
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-900">
            Registration Fields
          </h3>
          <button
            type="button"
            onClick={onAddField}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaPlus className="-ml-0.5 mr-1 h-3 w-3" />
            Add Field
          </button>
        </div>

        {formData.registrationFields &&
        formData.registrationFields.length > 0 ? (
          <div className="space-y-4 mt-3">
            {formData.registrationFields.map((field, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative group"
              >
                <button
                  type="button"
                  onClick={() => onRemoveField(index)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTrash className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label
                      htmlFor={`field-name-${index}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Field Name
                    </label>
                    <input
                      type="text"
                      id={`field-name-${index}`}
                      value={field.name || ""}
                      onChange={(e) =>
                        onFieldChange(index, "name", e.target.value)
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="E.g. Full Name, Company, Dietary Restrictions"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`field-type-${index}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Field Type
                    </label>
                    <select
                      id={`field-type-${index}`}
                      value={field.type || "text"}
                      onChange={(e) =>
                        onFieldChange(index, "type", e.target.value)
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      {fieldTypes.map((type) => (
                        <option
                          key={type}
                          value={type}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id={`field-required-${index}`}
                    type="checkbox"
                    checked={field.required || false}
                    onChange={(e) =>
                      onFieldChange(index, "required", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`field-required-${index}`}
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Required field
                  </label>
                </div>

                {field.type === "select" && (
                  <div className="mt-3">
                    <label
                      htmlFor={`field-options-${index}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Options (comma separated)
                    </label>
                    <input
                      type="text"
                      id={`field-options-${index}`}
                      value={(field.options || []).join(", ")}
                      onChange={(e) =>
                        onFieldChange(
                          index,
                          "options",
                          e.target.value.split(",").map((opt) => opt.trim())
                        )
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Option 1, Option 2, Option 3"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <FaCheck className="mx-auto h-8 w-8 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No custom fields added
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Add fields to collect additional information from attendees
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={onAddField}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaPlus className="-ml-1 mr-2 h-4 w-4" />
                Add Registration Field
              </button>
            </div>
          </div>
        )}
        <p className="mt-2 text-sm text-gray-500">
          Name and Email fields are automatically included.
        </p>
      </div>
    </div>
  )
}

export default RegistrationForm
