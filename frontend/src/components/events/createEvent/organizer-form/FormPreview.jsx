import React from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  Map,
  Tag,
  Ticket,
  User,
  Users,
  Globe,
  Clock,
  Mail,
  Phone,
  HelpCircle,
  MapPin,
  Image,
} from "lucide-react"

const FormPreview = ({ formData, bannerImage }) => {
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
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Event Preview
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Review your event details below before submitting. You can go back to
          edit any section if needed.
        </p>

        {/* Banner Image */}
        {bannerImage && (
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <Image
                size={16}
                className="mr-2"
              />{" "}
              Event Banner
            </h4>
            <div className="mt-2">
              <img
                src={
                  typeof bannerImage === "string"
                    ? bannerImage
                    : URL.createObjectURL(bannerImage)
                }
                alt="Event banner"
                className="max-h-64 w-full object-cover rounded-md"
              />
            </div>
          </div>
        )}

        {/* Event Header */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {formData.title || "Event Title"}
          </h2>
          <div className="flex flex-wrap items-center mt-2 text-sm text-gray-600 gap-3">
            <span className="flex items-center">
              <Calendar
                size={16}
                className="mr-1"
              />
              {formatDate(formData.startDate) || "Start Date"}
            </span>
            <span className="flex items-center">
              <Clock
                size={16}
                className="mr-1"
              />
              {formData.startTime || "Start Time"}
            </span>
            <span className="flex items-center">
              <MapPin
                size={16}
                className="mr-1"
              />
              {formData.locationType === "physical"
                ? `${formData.venue || "Venue"}, ${formData.city || "City"}`
                : formData.locationType === "online"
                ? "Online Event"
                : `${formData.venue || "Venue"}, ${
                    formData.city || "City"
                  } (Hybrid: ${formData.onlineLink || "No online link"})`}
            </span>
          </div>
        </div>

        {/* Basic Details */}
        <div className="bg-white p-4 rounded-md border border-gray-200 mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
            <Tag
              size={16}
              className="mr-2"
            />{" "}
            Basic Details
          </h4>
          <div className="space-y-3">
            <div>
              <span className="block text-xs text-gray-500">Category</span>
              <span className="block text-sm">
                {formData.category || "Not specified"}
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-500">Description</span>
              <span className="block text-sm whitespace-pre-wrap">
                {formData.description || "No description provided"}
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-500">Event Tags</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.tags.length > 0 ? (
                  formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No tags added</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="bg-white p-4 rounded-md border border-gray-200 mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
            <Map
              size={16}
              className="mr-2"
            />{" "}
            Location Details
          </h4>
          <div className="space-y-3">
            <div>
              <span className="block text-xs text-gray-500">Event Type</span>
              <span className="block text-sm capitalize">
                {formData.locationType || "Not specified"}
              </span>
            </div>
            {formData.locationType === "physical" ? (
              <>
                <div>
                  <span className="block text-xs text-gray-500">Venue</span>
                  <span className="block text-sm">
                    {formData.venue || "Not specified"}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500">Address</span>
                  <span className="block text-sm">
                    {formData.address ? (
                      <>
                        {formData.address}
                        <br />
                        {formData.city}{" "}
                        {formData.state && `, ${formData.state}`}{" "}
                        {formData.zipCode}
                        <br />
                        {formData.country}
                      </>
                    ) : (
                      "Not specified"
                    )}
                  </span>
                </div>
              </>
            ) : (
              <div>
                <span className="block text-xs text-gray-500">Online Link</span>
                <span className="block text-sm">
                  {formData.onlineLink || "Not specified"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Date and Time */}
        <div className="bg-white p-4 rounded-md border border-gray-200 mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
            <Calendar
              size={16}
              className="mr-2"
            />{" "}
            Date & Time
          </h4>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="block text-xs text-gray-500">Start Date</span>
                <span className="block text-sm">
                  {formatDate(formData.startDate) || "Not specified"}
                </span>
              </div>
              <div>
                <span className="block text-xs text-gray-500">End Date</span>
                <span className="block text-sm">
                  {formatDate(formData.endDate) || "Not specified"}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="block text-xs text-gray-500">Start Time</span>
                <span className="block text-sm">
                  {formData.startTime || "Not specified"}
                </span>
              </div>
              <div>
                <span className="block text-xs text-gray-500">End Time</span>
                <span className="block text-sm">
                  {formData.endTime || "Not specified"}
                </span>
              </div>
            </div>
            <div>
              <span className="block text-xs text-gray-500">Timezone</span>
              <span className="block text-sm">
                {formData.timezone || "Not specified"}
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-500">
                Registration Deadline
              </span>
              <span className="block text-sm">
                {formatDate(formData.registrationDeadline) || "Not specified"}
              </span>
            </div>
          </div>
        </div>

        {/* Ticket Details */}
        <div className="bg-white p-4 rounded-md border border-gray-200 mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
            <Ticket
              size={16}
              className="mr-2"
            />{" "}
            Ticket Details
          </h4>
          <div className="space-y-3">
            <div>
              <span className="block text-xs text-gray-500">Event Type</span>
              <span className="block text-sm">
                {formData.isPaid ? "Paid" : "Free"}
              </span>
            </div>
            {formData.isPaid && (
              <div>
                <span className="block text-xs text-gray-500">Price</span>
                <span className="block text-sm">
                  {formData.ticketPrice && formData.currency
                    ? `${formData.currency} ${formData.ticketPrice}`
                    : "This is a free event"}
                </span>
              </div>
            )}
            <div>
              <span className="block text-xs text-gray-500">
                Maximum Attendees
              </span>
              <span className="block text-sm">
                {formData.maxAttendees || "Not specified"}
              </span>
            </div>

            {formData.ticketTypes && formData.ticketTypes.length > 0 && (
              <div>
                <span className="block text-xs text-gray-500 mb-2">
                  Ticket Types
                </span>
                <div className="space-y-2">
                  {formData.ticketTypes.map((ticket, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-2 rounded border border-gray-100"
                    >
                      <span className="block text-sm font-medium">
                        Type: {ticket.name}
                      </span>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>
                          Price:{" "}
                          {formData.isPaid
                            ? `${formData.currency} ${ticket.price || "0"}`
                            : "Free"}
                        </span>
                        <span>Quantity: {ticket.quantity || "Unlimited"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Organiser Details */}
        <div className="bg-white p-4 rounded-md border border-gray-200 mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
            <User
              size={16}
              className="mr-2"
            />{" "}
            Organiser Details
          </h4>
          <div className="space-y-3">
            <div>
              <span className="block text-xs text-gray-500">Name</span>
              <span className="block text-sm">
                {formData.organiserName || "Not specified"}
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-500">Email</span>
              <span className="block text-sm">
                {formData.organiserEmail || "Not specified"}
              </span>
            </div>
            {formData.organiserPhone && (
              <div>
                <span className="block text-xs text-gray-500">Phone</span>
                <span className="block text-sm">{formData.organiserPhone}</span>
              </div>
            )}
            {formData.organiserWebsite && (
              <div>
                <span className="block text-xs text-gray-500">Website</span>
                <span className="block text-sm">
                  {formData.organiserWebsite}
                </span>
              </div>
            )}

            {/* Social Media */}
            {(formData.socialMedia.facebook ||
              formData.socialMedia.twitter ||
              formData.socialMedia.instagram ||
              formData.socialMedia.linkedin) && (
              <div>
                <span className="block text-xs text-gray-500 mb-1">
                  Social Media
                </span>
                <div className="flex flex-wrap gap-2">
                  {formData.socialMedia.facebook && (
                    <a
                      href={formData.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Facebook
                    </a>
                  )}
                  {formData.socialMedia.twitter && (
                    <a
                      href={formData.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Twitter
                    </a>
                  )}
                  {formData.socialMedia.instagram && (
                    <a
                      href={formData.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Instagram
                    </a>
                  )}
                  {formData.socialMedia.linkedin && (
                    <a
                      href={formData.socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Speakers */}
        {formData.speakers && formData.speakers.length > 0 && (
          <div className="bg-white p-4 rounded-md border border-gray-200 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <Users
                size={16}
                className="mr-2"
              />{" "}
              Speakers
            </h4>
            <div className="space-y-3">
              {formData.speakers.map((speaker, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-3 rounded-md border border-gray-100 flex items-center space-x-3"
                >
                  {speaker.photo && (
                    <img
                      src={
                        typeof speaker.photo === "string"
                          ? speaker.photo
                          : URL.createObjectURL(speaker.photo)
                      }
                      alt={speaker.name}
                      className="w-12 h-12 rounded-full border border-gray-300"
                    />
                  )}
                  <div>
                    <h5 className="font-medium text-sm">{speaker.name}</h5>
                    {speaker.company && (
                      <p className="text-xs text-gray-600 mt-1">
                        {speaker.company}
                      </p>
                    )}
                    {speaker.bio && (
                      <p className="text-xs text-gray-500 mt-1">
                        {speaker.bio}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agenda */}
        {formData.agenda && formData.agenda.length > 0 && (
          <div className="bg-white p-4 rounded-md border border-gray-200 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <Calendar
                size={16}
                className="mr-2"
              />{" "}
              Agenda
            </h4>
            <div className="space-y-3">
              {formData.agenda.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-3 rounded-md border border-gray-100"
                >
                  <div className="flex justify-between">
                    <h5 className="font-medium text-sm">{item.title}</h5>
                    {item.time && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {item.time}
                      </span>
                    )}
                  </div>
                  {item.speaker && (
                    <p className="text-xs text-gray-600 mt-1">
                      Speaker: {item.speaker}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sponsors */}
        {formData.sponsors && formData.sponsors.length > 0 && (
          <div className="bg-white p-4 rounded-md border border-gray-200 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <Globe
                size={16}
                className="mr-2"
              />{" "}
              Sponsors
            </h4>
            <div className="space-y-3">
              {formData.sponsors.map((sponsor, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-3 rounded-md border border-gray-100"
                >
                  <h5 className="font-medium text-sm">{sponsor.name}</h5>
                  {sponsor.website && (
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {sponsor.website}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs */}
        {formData.faqs && formData.faqs.length > 0 && (
          <div className="bg-white p-4 rounded-md border border-gray-200 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <HelpCircle
                size={16}
                className="mr-2"
              />{" "}
              FAQs
            </h4>
            <div className="space-y-4">
              {formData.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-3 rounded-md border border-gray-100"
                >
                  <h5 className="font-medium text-sm mb-1">{faq.question}</h5>
                  <p className="text-xs text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default FormPreview
