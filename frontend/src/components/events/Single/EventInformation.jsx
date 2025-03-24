import React from "react"
import { motion } from "framer-motion"
import { Map, Calendar, Clock, Globe } from "lucide-react"

const EventInformation = ({ event }) => {
  const {
    startDate,
    endDate,
    startTime,
    endTime,
    timezone,
    locationType,
    venue,
    address,
    city,
    state,
    zipCode,
    country,
    onlineLink,
    registrationDeadline,
  } = event

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-2xl font-bold mb-4">Event Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date & Time Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center text-gray-900">
            <Calendar
              size={18}
              className="mr-2 text-blue-600"
            />
            Date & Time
          </h3>

          <div className="space-y-3 pl-6">
            <div>
              <div className="text-sm text-gray-500">Start Date</div>
              <div className="font-medium">{formatDate(startDate)}</div>
            </div>

            {endDate && (
              <div>
                <div className="text-sm text-gray-500">End Date</div>
                <div className="font-medium">{formatDate(endDate)}</div>
              </div>
            )}

            <div>
              <div className="text-sm text-gray-500">Time</div>
              <div className="font-medium">
                {startTime}
                {endTime ? ` - ${endTime}` : ""}
              </div>
            </div>

            {timezone && (
              <div>
                <div className="text-sm text-gray-500">Timezone</div>
                <div className="font-medium">{timezone}</div>
              </div>
            )}

            {registrationDeadline && (
              <div>
                <div className="text-sm text-gray-500">
                  Registration Deadline
                </div>
                <div className="font-medium">
                  {formatDate(registrationDeadline)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center text-gray-900">
            <Map
              size={18}
              className="mr-2 text-blue-600"
            />
            Location
          </h3>

          <div className="space-y-3 pl-6">
            <div>
              <div className="text-sm text-gray-500">Event Type</div>
              <div className="font-medium capitalize">{locationType}</div>
            </div>

            {locationType === "physical" || locationType === "hybrid" ? (
              <>
                {venue && (
                  <div>
                    <div className="text-sm text-gray-500">Venue</div>
                    <div className="font-medium">{venue}</div>
                  </div>
                )}

                {address && (
                  <div>
                    <div className="text-sm text-gray-500">Address</div>
                    <address className="not-italic">
                      {address}
                      <br />
                      {city}
                      {state ? `, ${state}` : ""} {zipCode}
                      <br />
                      {country}
                    </address>
                  </div>
                )}

                {/* Simple map preview placeholder */}
                <div className="mt-2 bg-gray-100 h-32 rounded-md flex items-center justify-center">
                  <span className="text-gray-500 text-sm">
                    Map preview would go here
                  </span>
                </div>
              </>
            ) : null}

            {(locationType === "online" || locationType === "hybrid") &&
              onlineLink && (
                <div>
                  <div className="text-sm text-gray-500">Online Access</div>
                  <div className="font-medium text-blue-600 break-all">
                    <a
                      href={onlineLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center"
                    >
                      <Globe
                        size={14}
                        className="mr-1"
                      />
                      {onlineLink}
                    </a>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default EventInformation
