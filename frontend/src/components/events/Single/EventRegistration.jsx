import React, { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Users, Ticket, ChevronRight } from "lucide-react"

const EventRegistration = ({ event }) => {
  const [quantity, setQuantity] = useState(1)
  const [registering, setRegistering] = useState(false)

  const { price, currency, registrationEndDate, maxAttendees, availableSeats } =
    event

  const handleRegister = () => {
    setRegistering(true)

    // Simulate API call for registration
    setTimeout(() => {
      setRegistering(false)
      alert(`Registration successful for ${quantity} attendee(s)!`)
    }, 1000)
  }

  const isPaid = price && price > 0
  const isRestricted = maxAttendees && availableSeats !== undefined
  const isRegistrationOpen = new Date(registrationEndDate) > new Date()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-2xl font-bold mb-4">Registration</h2>

      <div className="space-y-4 mb-6">
        {isPaid && (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-700">
              <Ticket
                size={18}
                className="mr-2 text-blue-600"
              />
              <span>Ticket Price</span>
            </div>
            <span className="font-semibold text-lg">
              {formatCurrency(price)}
            </span>
          </div>
        )}

        {isRestricted && (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-700">
              <Users
                size={18}
                className="mr-2 text-blue-600"
              />
              <span>Available Seats</span>
            </div>
            <span className="font-semibold">
              {availableSeats} of {maxAttendees}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-700">
            <Calendar
              size={18}
              className="mr-2 text-blue-600"
            />
            <span>Registration Ends</span>
          </div>
          <span className="font-semibold">{registrationEndDate}</span>
        </div>
      </div>

      {isRegistrationOpen ? (
        <>
          <div className="mb-4">
            <label
              htmlFor="quantity"
              className="block text-gray-700 mb-2"
            >
              Number of Attendees
            </label>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-l-md hover:bg-gray-200"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                id="quantity"
                type="number"
                min="1"
                max={isRestricted ? availableSeats : 99}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="px-3 py-2 border-y border-gray-300 w-16 text-center focus:outline-none"
              />
              <button
                onClick={() =>
                  setQuantity(
                    Math.min(isRestricted ? availableSeats : 99, quantity + 1)
                  )
                }
                className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-r-md hover:bg-gray-200"
                disabled={isRestricted && quantity >= availableSeats}
              >
                +
              </button>
            </div>
          </div>

          <div className="text-right">
            {isPaid && (
              <p className="mb-2 font-semibold text-lg">
                Total: {formatCurrency(price * quantity)}
              </p>
            )}
            <button
              onClick={handleRegister}
              disabled={registering || (isRestricted && availableSeats < 1)}
              className={`w-full py-3 px-6 rounded-lg flex items-center justify-center font-medium text-white ${
                registering || (isRestricted && availableSeats < 1)
                  ? "bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition-colors`}
            >
              {registering ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-r-transparent rounded-full"></span>
                  Processing...
                </span>
              ) : isRestricted && availableSeats < 1 ? (
                "Sold Out"
              ) : (
                <span className="flex items-center">
                  Register Now
                  <ChevronRight
                    size={18}
                    className="ml-1"
                  />
                </span>
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-center">
          Registration for this event has ended.
        </div>
      )}
    </motion.div>
  )
}

export default EventRegistration
