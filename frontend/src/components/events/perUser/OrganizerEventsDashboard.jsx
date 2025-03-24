import React, { useState, useEffect, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../../context/AuthContext"
import { motion } from "framer-motion"
import {
  Calendar as CalendarIcon,
  Users as UsersIcon,
  Clock as ClockIcon,
  Tag as TagIcon,
  Pencil as PencilIcon,
  Trash as TrashIcon,
  Eye as EyeIcon,
  Plus as PlusIcon,
} from "lucide-react"

const OrganizerEventsDashboard = () => {
  const navigate = useNavigate()
  const { user, getAuthHeader, isAuthenticated } = useContext(AuthContext)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    pastEvents: 0,
    totalAttendees: 0,
  })
  const [filter, setFilter] = useState("all") // all, upcoming, past
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { returnTo: "/organizer/events" } })
    }
  }, [isAuthenticated, navigate])

  // Fetch organizer events
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return

      try {
        setLoading(true)
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/events`,
          {
            headers: getAuthHeader(),
          }
        )

        if (!response.ok) {
          throw new Error("Unable to fetch events.")
        }

        const data = await response.json()
        setEvents(data.events)

        // Calculate stats
        const now = new Date()
        const upcoming = data.events.filter(
          (event) => new Date(event.startDate) > now
        )
        const past = data.events.filter(
          (event) => new Date(event.startDate) <= now
        )
        const attendeesCount = data.events.reduce(
          (sum, event) => sum + (event.registrations?.length || 0),
          0
        )

        setStats({
          totalEvents: data.events.length,
          upcomingEvents: upcoming.length,
          pastEvents: past.length,
          totalAttendees: attendeesCount,
        })
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [user, getAuthHeader])

  // Handle event deletion
  const confirmDelete = (event) => {
    setEventToDelete(event)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!eventToDelete) return

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/events/${eventToDelete._id}`,
        {
          method: "DELETE",
          headers: getAuthHeader(),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete event")
      }

      // Update events list
      setEvents(events.filter((e) => e.id !== eventToDelete.id))

      // Update stats
      const now = new Date()
      if (new Date(eventToDelete.startDate) > now) {
        setStats((prev) => ({
          ...prev,
          totalEvents: prev.totalEvents - 1,
          upcomingEvents: prev.upcomingEvents - 1,
        }))
      } else {
        setStats((prev) => ({
          ...prev,
          totalEvents: prev.totalEvents - 1,
          pastEvents: prev.pastEvents - 1,
        }))
      }

      setShowDeleteModal(false)
      setEventToDelete(null)
    } catch (error) {
      console.error("Error deleting event:", error)
      alert(error.message || "Failed to delete event. Please try again.")
    }
  }

  // Filter events based on selected filter
  const filteredEvents = () => {
    const now = new Date()
    switch (filter) {
      case "upcoming":
        return events.filter((event) => new Date(event.startDate) > now)
      case "past":
        return events.filter((event) => new Date(event.startDate) <= now)
      default:
        return events
    }
  }

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200 max-w-md">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">My Events</h1>
            <Link
              to="/events/create"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Create New Event
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <CalendarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Events
                  </p>
                  <p className="text-2xl font-semibold text-gray-800">
                    {stats.totalEvents}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <ClockIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Upcoming Events
                  </p>
                  <p className="text-2xl font-semibold text-gray-800">
                    {stats.upcomingEvents}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <CalendarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Past Events
                  </p>
                  <p className="text-2xl font-semibold text-gray-800">
                    {stats.pastEvents}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <UsersIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Attendees
                  </p>
                  <p className="text-2xl font-semibold text-gray-800">
                    {stats.totalAttendees}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center mb-6">
            <span className="mr-3 text-sm font-medium text-gray-700">
              Filter:
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 text-sm rounded-md ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All Events
              </button>
              <button
                onClick={() => setFilter("upcoming")}
                className={`px-4 py-2 text-sm rounded-md ${
                  filter === "upcoming"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter("past")}
                className={`px-4 py-2 text-sm rounded-md ${
                  filter === "past"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Past
              </button>
            </div>
          </div>

          {/* Events Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {filteredEvents().length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-lg font-medium text-gray-700">
                  No events found
                </h3>
                <p className="text-gray-500 mt-2">
                  {filter === "all"
                    ? "You haven't created any events yet."
                    : filter === "upcoming"
                    ? "You don't have any upcoming events."
                    : "You don't have any past events."}
                </p>
                <Link
                  to="/events/create"
                  className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Your First Event
                </Link>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Event
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Registrations
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEvents().map((event) => {
                    const eventDate = new Date(event.startDate)
                    const isUpcoming = eventDate > new Date()

                    return (
                      <tr
                        key={event.id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-md bg-gray-200 overflow-hidden">
                              {event.coverImage ? (
                                <img
                                  src={event.coverImage}
                                  alt={event.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-500">
                                  <CalendarIcon className="h-6 w-6" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {event.title}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {event.venue ||
                                  event.location ||
                                  "Online Event"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(event.startDate)}
                          </div>
                          {event.endDate && (
                            <div className="text-sm text-gray-500">
                              {event.startDate !== event.endDate
                                ? `to ${formatDate(event.endDate)}`
                                : ""}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <TagIcon className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-500">
                              {event.category || "Uncategorized"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <UsersIcon className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-900">
                              {event.registrations?.length || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              isUpcoming
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {isUpcoming ? "Upcoming" : "Past"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link
                              to={`/event/${event._id}`}
                              className="text-gray-500 hover:text-gray-700 bg-gray-100 p-2 rounded-md"
                              title="View"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </Link>
                            <Link
                              to={`/event/${event._id}`}
                              className="text-blue-500 hover:text-blue-700 bg-blue-100 p-2 rounded-md"
                              title="Edit"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => confirmDelete(event)}
                              className="text-red-500 hover:text-red-700 bg-red-100 p-2 rounded-md"
                              title="Delete"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Confirm Deletion
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to delete the event "
                  {eventToDelete?.title}"? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default OrganizerEventsDashboard
