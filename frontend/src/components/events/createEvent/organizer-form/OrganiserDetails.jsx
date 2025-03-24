import React from "react"
import { motion } from "framer-motion"
import { User, Mail, Phone, Globe } from "lucide-react"

const OrganiserDetails = ({ formData, updateFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    updateFormData("organiser", { [name]: value })
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Organizer Information
        </h3>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="organiserName"
              className="block text-sm font-medium text-gray-700 flex items-center"
            >
              <User
                size={16}
                className="mr-1"
              />{" "}
              Organizer Name*
            </label>
            <input
              type="text"
              id="organiserName"
              name="organiserName"
              value={formData.organiserName}
              onChange={handleChange}
              placeholder="e.g. Tech Events Inc."
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="organiserEmail"
              className="block text-sm font-medium text-gray-700 flex items-center"
            >
              <Mail
                size={16}
                className="mr-1"
              />{" "}
              Contact Email*
            </label>
            <input
              type="email"
              id="organiserEmail"
              name="organiserEmail"
              value={formData.organiserEmail}
              onChange={handleChange}
              placeholder="e.g. events@example.com"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              This email will receive notifications and attendee questions
            </p>
          </div>

          <div>
            <label
              htmlFor="organiserPhone"
              className="block text-sm font-medium text-gray-700 flex items-center"
            >
              <Phone
                size={16}
                className="mr-1"
              />{" "}
              Contact Phone
            </label>
            <input
              type="tel"
              id="organiserPhone"
              name="organiserPhone"
              value={formData.organiserPhone}
              onChange={handleChange}
              placeholder="e.g. +1 (123) 456-7890"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="organiserWebsite"
              className="block text-sm font-medium text-gray-700 flex items-center"
            >
              <Globe
                size={16}
                className="mr-1"
              />{" "}
              Organization Website
            </label>
            <input
              type="url"
              id="organiserWebsite"
              name="organiserWebsite"
              value={formData.organiserWebsite}
              onChange={handleChange}
              placeholder="e.g. https://example.com"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Social Media Links
            </h4>

            <div className="space-y-3">
              <div>
                <label
                  htmlFor="facebook"
                  className="block text-xs font-medium text-gray-700"
                >
                  Facebook Page
                </label>
                <input
                  type="url"
                  id="facebook"
                  name="socialMedia.facebook"
                  value={formData.socialMedia.facebook}
                  onChange={(e) =>
                    updateFormData("organiser", {
                      socialMedia: {
                        ...formData.socialMedia,
                        facebook: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. https://facebook.com/yourpage"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="twitter"
                  className="block text-xs font-medium text-gray-700"
                >
                  Twitter Profile
                </label>
                <input
                  type="url"
                  id="twitter"
                  name="socialMedia.twitter"
                  value={formData.socialMedia.twitter}
                  onChange={(e) =>
                    updateFormData("organiser", {
                      socialMedia: {
                        ...formData.socialMedia,
                        twitter: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. https://twitter.com/yourhandle"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="instagram"
                  className="block text-xs font-medium text-gray-700"
                >
                  Instagram Profile
                </label>
                <input
                  type="url"
                  id="instagram"
                  name="socialMedia.instagram"
                  value={formData.socialMedia.instagram}
                  onChange={(e) =>
                    updateFormData("organiser", {
                      socialMedia: {
                        ...formData.socialMedia,
                        instagram: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. https://instagram.com/yourhandle"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="linkedin"
                  className="block text-xs font-medium text-gray-700"
                >
                  LinkedIn Page
                </label>
                <input
                  type="url"
                  id="linkedin"
                  name="socialMedia.linkedin"
                  value={formData.socialMedia.linkedin}
                  onChange={(e) =>
                    updateFormData("organiser", {
                      socialMedia: {
                        ...formData.socialMedia,
                        linkedin: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. https://linkedin.com/company/yourcompany"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default OrganiserDetails
