import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import BasicDetails from "./BasicDetails"
import LocationDetails from "./LocationDetails"
import DateTimeDetails from "./DateTimeDetails"
import TicketDetails from "./TicketDetails"
import OrganiserDetails from "./OrganiserDetails"
import AdditionalDetails from "./AdditionalDetails"
import FormPreview from "./FormPreview"
import FormSubmit from "./FormSubmit"
import {
  Check,
  ChevronRight,
  FileText,
  MapPin,
  Calendar,
  Ticket,
  User,
  Info,
  Eye,
} from "lucide-react"

const EventForm = ({ initialBannerImage }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [bannerImage, setBannerImage] = useState(initialBannerImage || null)
  const [formData, setFormData] = useState({
    // Basic details
    title: "",
    category: "",
    description: "",
    featuredImage: null,
    galleryImages: [],

    // Location details
    locationType: "physical", // or 'online'
    venue: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    onlineLink: "",

    // Date and time
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    timezone: "UTC",
    registrationDeadline: "",

    // Ticket details
    isPaid: false,
    ticketPrice: "",
    currency: "USD",
    ticketTypes: [{ name: "General Admission", price: "", quantity: "" }],
    maxAttendees: "",

    // Organiser details
    organiserName: "",
    organiserEmail: "",
    organiserPhone: "",
    organiserWebsite: "",

    // Additional details
    tags: [],
    sponsors: [],
    speakers: [],
    agenda: [],
    faqs: [],
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },
  })

  useEffect(() => {
    if (initialBannerImage) {
      setBannerImage(initialBannerImage)
      setFormData((prev) => ({
        ...prev,
        featuredImage: initialBannerImage,
      }))
    }
  }, [initialBannerImage])

  const handleHeroImageUpload = (imageFile) => {
    setBannerImage(imageFile)
    // Also update the formData
    setFormData((prev) => ({
      ...prev,
      featuredImage: imageFile,
    }))
  }

  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }))
  }

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 7))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const formSteps = [
    { id: 1, title: "Basic Details", component: BasicDetails, icon: FileText },
    { id: 2, title: "Location", component: LocationDetails, icon: MapPin },
    { id: 3, title: "Date & Time", component: DateTimeDetails, icon: Calendar },
    { id: 4, title: "Tickets", component: TicketDetails, icon: Ticket },
    { id: 5, title: "Organizer", component: OrganiserDetails, icon: User },
    {
      id: 6,
      title: "Additional Info",
      component: AdditionalDetails,
      icon: Info,
    },
    { id: 7, title: "Preview & Submit", component: FormPreview, icon: Eye },
  ]

  const CurrentStepComponent = formSteps.find(
    (step) => step.id === currentStep
  )?.component

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Progress bar */}
      <div className="px-4 py-5 sm:px-6 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Step {currentStep} of {formSteps.length}
          </h3>
          <span className="text-sm text-gray-500">
            {formSteps.find((step) => step.id === currentStep)?.title}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <motion.div
            className="bg-blue-600 h-2.5 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${(currentStep / formSteps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Steps indicator with icons */}
        <div className="hidden sm:flex justify-between mt-4">
          {formSteps.map((step) => {
            const StepIcon = step.icon
            return (
              <div
                key={step.id}
                className="flex flex-col items-center"
              >
                <motion.div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step.id < currentStep
                      ? "bg-green-500 text-white"
                      : step.id === currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                  animate={{
                    scale: step.id === currentStep ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: step.id === currentStep ? Infinity : 0,
                    repeatType: "reverse",
                  }}
                >
                  {step.id < currentStep ? (
                    <Check size={16} />
                  ) : (
                    <StepIcon size={16} />
                  )}
                </motion.div>
                <span className="text-xs mt-1 hidden md:block">
                  {step.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Form content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="px-4 py-6 sm:p-6"
      >
        {CurrentStepComponent && (
          <CurrentStepComponent
            formData={formData}
            updateFormData={updateFormData}
          />
        )}

        {currentStep === 7 && (
          <FormSubmit
            formData={formData}
            bannerImage={bannerImage}
          />
        )}
      </motion.div>

      {/* Navigation buttons */}
      <div className="px-4 py-4 sm:px-6 bg-gray-50 flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            currentStep === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Previous
        </button>

        <button
          type="button"
          onClick={currentStep < 7 ? nextStep : () => {}}
          className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
            currentStep === 7
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {currentStep === 7 ? (
            "Submit"
          ) : (
            <>
              Next{" "}
              <ChevronRight
                size={16}
                className="ml-1"
              />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default EventForm
