import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaTimes } from "react-icons/fa"

// Form components for different sections
import BasicInfoForm from "./forms/BasicInfoForm"
import DescriptionForm from "./forms/DescriptionForm"
import InformationForm from "./forms/InformationForm"
import SpeakersForm from "./forms/SpeakersForm"
import AgendaForm from "./forms/AgendaForm"
import SponsorsForm from "./forms/SponsorsForm"
import FAQsForm from "./forms/FAQsForm"
import RegistrationForm from "./forms/RegistrationForm"
import OrganizerForm from "./forms/OrganizerForm"

const EditEventModal = ({ section, eventData, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [previewMode, setPreviewMode] = useState(false)
  const [activeSection, setActiveSection] = useState(section)

  useEffect(() => {
    // Update active section when section prop changes
    setActiveSection(section)

    // Initialize form data based on section and event data
    let initialData = {}

    switch (section) {
      case "basic":
        initialData = {
          title: eventData.title || "",
          category: eventData.category || "",
          startDate: eventData.startDate || "",
          endDate: eventData.endDate || "",
          bannerImage: eventData.bannerImage || "",
        }
        break
      case "description":
        initialData = {
          description: eventData.description || "",
          highlights: eventData.highlights || [],
        }
        break
      case "information":
        initialData = {
          location: eventData.location || "",
          venue: eventData.venue || "",
          address: eventData.address || "",
          city: eventData.city || "",
          state: eventData.state || "",
          zipCode: eventData.zipCode || "",
          country: eventData.country || "",
          virtualLink: eventData.virtualLink || "",
          isVirtual: eventData.isVirtual || false,
          isHybrid: eventData.isHybrid || false,
        }
        break
      case "speakers":
        initialData = {
          speakers: eventData.speakers || [],
        }
        break
      case "agenda":
        initialData = {
          agenda: eventData.agenda || [],
        }
        break
      case "sponsors":
        initialData = {
          sponsors: eventData.sponsors || [],
        }
        break
      case "faqs":
        initialData = {
          faqs: eventData.faqs || [],
        }
        break
      case "registration":
        initialData = {
          registrationType: eventData.registrationType || "free",
          price: eventData.price || 0,
          currency: eventData.currency || "USD",
          maxAttendees: eventData.maxAttendees || 0,
          registrationDeadline: eventData.registrationDeadline || "",
          registrationFields: eventData.registrationFields || [],
          ticketTypes: eventData.ticketTypes || [],
        }
        break
      case "organizer":
        initialData = {
          organizerName: eventData.organizerName || "",
          organizerEmail: eventData.organizerEmail || "",
          organizerPhone: eventData.organizerPhone || "",
          organizerWebsite: eventData.organizerWebsite || "",
          socialMedia: eventData.socialMedia || {},
        }
        break
      default:
        initialData = {}
    }

    setFormData(initialData)
  }, [section, eventData])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const updatedFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    }
    setFormData(updatedFormData)

    // Apply changes in real-time to preview if enabled
    if (previewMode) {
      onSave({ section: activeSection, data: updatedFormData })
    }
  }

  const handleArrayItemChange = (arrayName, index, field, value) => {
    const updatedArray = [...formData[arrayName]]
    updatedArray[index] = {
      ...updatedArray[index],
      [field]: value,
    }
    const updatedFormData = {
      ...formData,
      [arrayName]: updatedArray,
    }
    setFormData(updatedFormData)

    // Apply changes in real-time to preview if enabled
    if (previewMode) {
      onSave({ section: activeSection, data: updatedFormData })
    }
  }

  const handleAddArrayItem = (arrayName, defaultItem) => {
    const updatedFormData = {
      ...formData,
      [arrayName]: [...(formData[arrayName] || []), defaultItem],
    }
    setFormData(updatedFormData)

    // Apply changes in real-time to preview if enabled
    if (previewMode) {
      onSave({ section: activeSection, data: updatedFormData })
    }
  }

  const handleRemoveArrayItem = (arrayName, index) => {
    const updatedArray = [...formData[arrayName]]
    updatedArray.splice(index, 1)
    const updatedFormData = {
      ...formData,
      [arrayName]: updatedArray,
    }
    setFormData(updatedFormData)

    // Apply changes in real-time to preview if enabled
    if (previewMode) {
      onSave({ section: activeSection, data: updatedFormData })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (activeSection === "basic") {
      if (!formData.title) newErrors.title = "Title is required"
      if (!formData.category) newErrors.category = "Category is required"
      if (!formData.startDate) newErrors.startDate = "Start date is required"
    } else if (activeSection === "description") {
      if (!formData.description)
        newErrors.description = "Description is required"
    } else if (
      activeSection === "registration" &&
      formData.registrationType === "paid"
    ) {
      if (!formData.price) newErrors.price = "Price is required for paid events"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      await onSave({ section: activeSection, data: formData })
      if (!previewMode) {
        onClose()
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error("Error saving form:", error)
      setLoading(false)
    }
  }

  const togglePreviewMode = () => {
    const newPreviewMode = !previewMode
    setPreviewMode(newPreviewMode)

    // If turning preview mode on, apply the current changes
    if (newPreviewMode) {
      onSave({ section: activeSection, data: formData })
    }
  }

  // Render form based on active section
  const renderForm = () => {
    switch (activeSection) {
      case "basic":
        return (
          <BasicInfoForm
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
          />
        )
      case "description":
        return (
          <DescriptionForm
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
            onHighlightChange={(index, value) =>
              handleArrayItemChange("highlights", index, "text", value)
            }
            onAddHighlight={() =>
              handleAddArrayItem("highlights", { text: "" })
            }
            onRemoveHighlight={(index) =>
              handleRemoveArrayItem("highlights", index)
            }
          />
        )
      case "information":
        return (
          <InformationForm
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
          />
        )
      case "speakers":
        return (
          <SpeakersForm
            speakers={formData.speakers}
            errors={errors}
            onSpeakerChange={(index, field, value) =>
              handleArrayItemChange("speakers", index, field, value)
            }
            onAddSpeaker={() =>
              handleAddArrayItem("speakers", {
                name: "",
                title: "",
                bio: "",
                photoUrl: "",
              })
            }
            onRemoveSpeaker={(index) =>
              handleRemoveArrayItem("speakers", index)
            }
          />
        )
      case "agenda":
        return (
          <AgendaForm
            agenda={formData.agenda}
            errors={errors}
            onAgendaItemChange={(index, field, value) =>
              handleArrayItemChange("agenda", index, field, value)
            }
            onAddAgendaItem={() =>
              handleAddArrayItem("agenda", {
                time: "",
                title: "",
                description: "",
                speaker: "",
              })
            }
            onRemoveAgendaItem={(index) =>
              handleRemoveArrayItem("agenda", index)
            }
          />
        )
      case "sponsors":
        return (
          <SponsorsForm
            sponsors={formData.sponsors}
            errors={errors}
            onSponsorChange={(index, field, value) =>
              handleArrayItemChange("sponsors", index, field, value)
            }
            onAddSponsor={() =>
              handleAddArrayItem("sponsors", {
                name: "",
                level: "gold",
                logo: "",
                website: "",
              })
            }
            onRemoveSponsor={(index) =>
              handleRemoveArrayItem("sponsors", index)
            }
          />
        )
      case "faqs":
        return (
          <FAQsForm
            faqs={formData.faqs}
            errors={errors}
            onFaqChange={(index, field, value) =>
              handleArrayItemChange("faqs", index, field, value)
            }
            onAddFaq={() =>
              handleAddArrayItem("faqs", {
                question: "",
                answer: "",
              })
            }
            onRemoveFaq={(index) => handleRemoveArrayItem("faqs", index)}
          />
        )
      case "registration":
        return (
          <RegistrationForm
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
            onTicketTypeChange={(index, field, value) =>
              handleArrayItemChange("ticketTypes", index, field, value)
            }
            onAddTicketType={() =>
              handleAddArrayItem("ticketTypes", {
                name: "",
                description: "",
                price: 0,
                quantity: 0,
              })
            }
            onRemoveTicketType={(index) =>
              handleRemoveArrayItem("ticketTypes", index)
            }
            onFieldChange={(index, field, value) =>
              handleArrayItemChange("registrationFields", index, field, value)
            }
            onAddField={() =>
              handleAddArrayItem("registrationFields", {
                name: "",
                type: "text",
                required: true,
                options: [],
              })
            }
            onRemoveField={(index) =>
              handleRemoveArrayItem("registrationFields", index)
            }
          />
        )
      case "organizer":
        return (
          <OrganizerForm
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
            onSocialMediaChange={(platform, value) => {
              const updatedFormData = {
                ...formData,
                socialMedia: {
                  ...(formData.socialMedia || {}),
                  [platform]: value,
                },
              }
              setFormData(updatedFormData)

              // Apply changes in real-time to preview if enabled
              if (previewMode) {
                onSave({ section: activeSection, data: updatedFormData })
              }
            }}
          />
        )
      default:
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-700">
              Unknown section: {activeSection}. Please select a valid section to
              edit.
            </p>
          </div>
        )
    }
  }

  // Modal title based on section
  const getModalTitle = () => {
    switch (activeSection) {
      case "basic":
        return "Edit Basic Information"
      case "description":
        return "Edit Description"
      case "information":
        return "Edit Event Details"
      case "speakers":
        return "Edit Speakers"
      case "agenda":
        return "Edit Agenda"
      case "sponsors":
        return "Edit Sponsors"
      case "faqs":
        return "Edit FAQs"
      case "registration":
        return "Edit Registration"
      case "organizer":
        return "Edit Organizer Information"
      default:
        return "Edit Event"
    }
  }

  // Section navigation
  const sectionOptions = [
    { id: "basic", label: "Basic Info" },
    { id: "description", label: "Description" },
    { id: "information", label: "Location" },
    { id: "speakers", label: "Speakers" },
    { id: "agenda", label: "Agenda" },
    { id: "sponsors", label: "Sponsors" },
    { id: "faqs", label: "FAQs" },
    { id: "registration", label: "Registration" },
    { id: "organizer", label: "Organizer" },
  ]

  const changeSection = (newSection) => {
    // Confirm if there are unsaved changes
    setActiveSection(newSection)
  }

  // Function to stop propagation
  const handleModalContentClick = (e) => {
    e.stopPropagation()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={onClose}
            >
              <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <motion.div
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:max-w-2xl lg:max-w-4xl border-4 border-white"
              onClick={handleModalContentClick} // Stop event propagation here
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {getModalTitle()}
                      </h3>
                      <div className="flex items-center gap-3">
                        {/* Live Preview Toggle - with clear ON/OFF indicator */}
                        <div className="flex items-center bg-gray-100 rounded-md p-1">
                          <span className="text-sm mr-2 font-medium text-gray-700 ml-2">
                            Live Preview:
                          </span>
                          <button
                            type="button"
                            onClick={togglePreviewMode}
                            className={`text-sm px-3 py-1 rounded-md font-medium transition-colors ${
                              !previewMode
                                ? "bg-red-600 text-white"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            OFF
                          </button>
                          <button
                            type="button"
                            onClick={togglePreviewMode}
                            className={`text-sm px-3 py-1 rounded-md font-medium transition-colors ${
                              previewMode
                                ? "bg-green-600 text-white"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            ON
                          </button>
                        </div>
                        <button
                          type="button"
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                          onClick={onClose}
                        >
                          <span className="sr-only">Close</span>
                          <FaTimes className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Section Navigation Tabs */}
                    <div className="mb-6 border-b border-gray-200 overflow-x-auto">
                      <nav className="-mb-px flex space-x-1">
                        {sectionOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => changeSection(option.id)}
                            className={`whitespace-nowrap py-2 px-3 text-sm font-medium ${
                              activeSection === option.id
                                ? "border-b-2 border-blue-600 text-blue-600"
                                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </nav>
                    </div>

                    {/* Active Section Info Banner */}
                    <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-md text-sm">
                      <span className="font-medium">Currently editing:</span>{" "}
                      {getModalTitle()}
                      {previewMode && (
                        <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
                          Live Preview ON
                        </span>
                      )}
                    </div>

                    <form
                      onSubmit={handleSubmit}
                      className="mt-2"
                    >
                      <div className="space-y-6">{renderForm()}</div>
                      <div className="mt-6 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={loading}
                          className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${
                            loading ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                        >
                          {loading
                            ? "Saving..."
                            : previewMode
                            ? "Apply & Close"
                            : "Save Changes"}
                        </button>
                        {previewMode && (
                          <button
                            type="button"
                            onClick={() =>
                              onSave({ section: activeSection, data: formData })
                            }
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-blue-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            Apply Changes
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={onClose}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default EditEventModal
