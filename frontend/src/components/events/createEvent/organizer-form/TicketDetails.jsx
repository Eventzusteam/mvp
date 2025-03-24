import React from "react"
import { motion } from "framer-motion"
import { Ticket, Plus, Trash2, DollarSign } from "lucide-react"

const TicketDetails = ({ formData, updateFormData }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    updateFormData("ticket", { [name]: type === "checkbox" ? checked : value })
  }

  const updateTicketType = (index, field, value) => {
    const updatedTicketTypes = [...formData.ticketTypes]
    updatedTicketTypes[index][field] = value
    updateFormData("ticket", { ticketTypes: updatedTicketTypes })
  }

  const addTicketType = () => {
    const updatedTicketTypes = [
      ...formData.ticketTypes,
      { name: "", price: "", quantity: "" },
    ]
    updateFormData("ticket", { ticketTypes: updatedTicketTypes })
  }

  const removeTicketType = (index) => {
    const updatedTicketTypes = [...formData.ticketTypes]
    updatedTicketTypes.splice(index, 1)
    updateFormData("ticket", { ticketTypes: updatedTicketTypes })
  }

  const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CNY", "INR"]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Ticket Information
        </h3>

        <div className="space-y-5">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPaid"
              name="isPaid"
              checked={formData.isPaid}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="isPaid"
              className="ml-2 block text-sm text-gray-700"
            >
              This is a paid event
            </label>
          </div>

          {formData.isPaid && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Ticket
                    size={16}
                    className="mr-1"
                  />{" "}
                  Ticket Types
                </h4>

                {formData.ticketTypes.map((ticket, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-md mb-3"
                  >
                    <div className="flex justify-between mb-2">
                      <h5 className="text-sm font-medium text-gray-700">
                        Ticket Type {index + 1}
                      </h5>
                      {formData.ticketTypes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTicketType(index)}
                          className="text-red-500 hover:text-red-700 flex items-center text-xs"
                        >
                          <Trash2
                            size={14}
                            className="mr-1"
                          />{" "}
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label
                          htmlFor={`ticketName-${index}`}
                          className="block text-xs font-medium text-gray-700"
                        >
                          Name*
                        </label>
                        <input
                          type="text"
                          id={`ticketName-${index}`}
                          value={ticket.name}
                          onChange={(e) =>
                            updateTicketType(index, "name", e.target.value)
                          }
                          placeholder="e.g. General Admission"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`ticketPrice-${index}`}
                          className="block text-xs font-medium text-gray-700"
                        >
                          Price*
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                            {formData.currency}
                          </span>
                          <input
                            type="number"
                            id={`ticketPrice-${index}`}
                            value={ticket.price}
                            onChange={(e) =>
                              updateTicketType(index, "price", e.target.value)
                            }
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className="flex-1 block w-full border border-gray-300 rounded-none rounded-r-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor={`ticketQuantity-${index}`}
                          className="block text-xs font-medium text-gray-700"
                        >
                          Quantity*
                        </label>
                        <input
                          type="number"
                          id={`ticketQuantity-${index}`}
                          value={ticket.quantity}
                          onChange={(e) =>
                            updateTicketType(index, "quantity", e.target.value)
                          }
                          placeholder="e.g. 100"
                          min="1"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addTicketType}
                  className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-500"
                >
                  <Plus
                    size={16}
                    className="mr-1"
                  />{" "}
                  Add another ticket type
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="currency"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Currency*
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    {currencies.map((currency) => (
                      <option
                        key={currency}
                        value={currency}
                      >
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          <div>
            <label
              htmlFor="maxAttendees"
              className="block text-sm font-medium text-gray-700"
            >
              Maximum Attendees (Optional)
            </label>
            <input
              type="number"
              id="maxAttendees"
              name="maxAttendees"
              value={formData.maxAttendees}
              onChange={handleChange}
              placeholder="Leave blank for unlimited"
              min="1"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              Set a limit for the total number of attendees
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default TicketDetails
