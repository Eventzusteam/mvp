import React, { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { AuthContext } from "../../../context/AuthContext"
import EventHeader from "./EventHeader"
import EventDescription from "./EventDescription"
import EventInformation from "./EventInformation"
import EventOrganizer from "./EventOrganizer"
import EventSpeakers from "./EventSpeakers"
import EventAgenda from "./EventAgenda"
import EventSponsors from "./EventSponsors"
import EventFAQs from "./EventFAQs"
import EventRegistration from "./EventRegistration"
import EventShare from "./EventShare"
import RelatedEvents from "./RelatedEvents"
import EditEventModal from "./EditEventModal"
import { toast } from "react-toastify"

// Create a simpler EditButton component
const EditButton = ({ onClick, label }) => (
  <button
    onClick={onClick}
    className="absolute top-4 right-4 bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-full transition-colors flex items-center disabled cursor-not-allowed"
    title={`Edit ${label}`}
    aria-label={`Edit ${label}`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  </button>
)

const EventDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, getAuthHeader, isAuthenticated } = useContext(AuthContext)

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editSection, setEditSection] = useState(null)

  // Check if current user is the organizer of this event
  const isOrganizer = user && event && user.id === event.organizerId

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/events/${id}`,
          {
            method: "GET",
            headers: {
              ...getAuthHeader(),
              "Content-Type": "application/json",
            },
          }
        )

        if (!response.ok) {
          throw new Error("This event does not exist or was removed.")
        }

        const data = await response.json()
        setEvent(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEventDetails()
  }, [id, getAuthHeader])

  // Function to handle saving edits
  const handleSaveEdit = async (sectionData, section) => {
    try {
      setLoading(true)

      // Use the current section being edited
      const targetSection = section || editSection

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/events/${id}/${targetSection}`,
        {
          method: "PATCH",
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sectionData),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update event")
      }

      // Get updated event data
      const updatedData = await response.json()

      // Update local state with new data
      setEvent((prev) => ({
        ...prev,
        ...updatedData,
      }))

      setIsEditMode(false)
      setEditSection(null)
      toast.success("Event updated successfully!")
    } catch (error) {
      console.error("Error updating event:", error)
      toast.error(error.message || "Failed to update event. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Function to register for event
  const handleRegister = async (registrationData) => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      toast.info("Please log in to register for this event")
      navigate("/login", { state: { returnTo: `/events/${id}` } })
      return
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/events/${id}/register`,
        {
          method: "POST",
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registrationData),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Registration failed")
      }

      const data = await response.json()
      toast.success("Successfully registered for the event!")
      return data
    } catch (error) {
      console.error("Registration error:", error)
      toast.error(error.message || "Failed to register. Please try again.")
      throw error
    }
  }

  // Function to trigger edit mode for a specific section
  const toggleEditMode = (section) => {
    if (isOrganizer) {
      setEditSection(section)
      setIsEditMode(true)
    }
  }

  // Function to cancel editing
  const cancelEdit = () => {
    setIsEditMode(false)
    setEditSection(null)
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
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200 max-w-md">
          <h2 className="text-xl font-bold text-yellow-700 mb-2">
            Event Not Found
          </h2>
          <p className="text-yellow-600">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/events")}
            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            Browse Events
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      <main className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Event Header with edit button */}
          <div className="bg-white rounded-lg shadow-sm p-6 relative">
            {isOrganizer && (
              <EditButton
                onClick={() => toggleEditMode("basic")}
                label="Basic Info"
              />
            )}
            <EventHeader event={event} />
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content - 2/3 width on large screens */}
            <div className="lg:col-span-2 space-y-8">
              {/* Event Information with edit button */}
              <div className="bg-white rounded-lg shadow-sm p-6 relative">
                {isOrganizer && (
                  <EditButton
                    onClick={() => toggleEditMode("information")}
                    label="Information"
                  />
                )}
                <EventInformation event={event} />
              </div>

              {/* Event Description with edit button */}
              <div className="bg-white rounded-lg shadow-sm p-6 relative">
                {isOrganizer && (
                  <EditButton
                    onClick={() => toggleEditMode("description")}
                    label="Description"
                  />
                )}
                <EventDescription event={event} />
              </div>

              {/* Event Speakers with edit button */}
              {(event.speakers?.length > 0 || isOrganizer) && (
                <div className="bg-white rounded-lg shadow-sm p-6 relative">
                  {isOrganizer && (
                    <EditButton
                      onClick={() => toggleEditMode("speakers")}
                      label="Speakers"
                    />
                  )}
                  <EventSpeakers speakers={event.speakers || []} />
                </div>
              )}

              {/* Event Agenda with edit button */}
              {(event.agenda?.length > 0 || isOrganizer) && (
                <div className="bg-white rounded-lg shadow-sm p-6 relative">
                  {isOrganizer && (
                    <EditButton
                      onClick={() => toggleEditMode("agenda")}
                      label="Agenda"
                    />
                  )}
                  <EventAgenda agenda={event.agenda || []} />
                </div>
              )}

              {/* Event Sponsors with edit button */}
              {(event.sponsors?.length > 0 || isOrganizer) && (
                <div className="bg-white rounded-lg shadow-sm p-6 relative">
                  {isOrganizer && (
                    <EditButton
                      onClick={() => toggleEditMode("sponsors")}
                      label="Sponsors"
                    />
                  )}
                  <EventSponsors sponsors={event.sponsors || []} />
                </div>
              )}

              {/* Event FAQs with edit button */}
              {(event.faqs?.length > 0 || isOrganizer) && (
                <div className="bg-white rounded-lg shadow-sm p-6 relative">
                  {isOrganizer && (
                    <EditButton
                      onClick={() => toggleEditMode("faqs")}
                      label="FAQs"
                    />
                  )}
                  <EventFAQs faqs={event.faqs || []} />
                </div>
              )}
            </div>

            {/* Sidebar - 1/3 width on large screens */}
            <div className="space-y-8">
              {/* Event Registration with edit button */}
              <div className="bg-white rounded-lg shadow-sm p-6 relative">
                {isOrganizer && (
                  <EditButton
                    onClick={() => toggleEditMode("registration")}
                    label="Registration"
                  />
                )}
                <EventRegistration
                  event={event}
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onRegister={handleRegister}
                />
              </div>

              {/* Event Organizer with edit button */}
              <div className="bg-white rounded-lg shadow-sm p-6 relative">
                {isOrganizer && (
                  <EditButton
                    onClick={() => toggleEditMode("organizer")}
                    label="Organizer Info"
                  />
                )}
                <EventOrganizer
                  organizer={{
                    id: event.organizerId,
                    name: event.organizerName,
                    email: event.organizerEmail,
                    phone: event.organizerPhone,
                    website: event.organizerWebsite,
                    socialMedia: event.socialMedia,
                  }}
                />
              </div>

              {/* Event Share */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <EventShare
                  eventId={event.id}
                  title={event.title}
                />
              </div>
            </div>
          </div>

          {/* Related Events Section */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <RelatedEvents
                category={event.category}
                currentEventId={event.id}
              />
            </div>
          </div>

          {/* Edit Modal - conditionally rendered when in edit mode */}
          {isEditMode && editSection && (
            <EditEventModal
              section={editSection}
              eventData={event}
              isOpen={isEditMode}
              onClose={cancelEdit}
              onSave={(data) => handleSaveEdit(data, editSection)}
            />
          )}
        </motion.div>
      </main>
    </div>
  )
}

export default EventDetails
