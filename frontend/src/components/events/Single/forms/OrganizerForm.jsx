import React from "react"
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa"

const OrganizerForm = ({ formData, errors, onChange, onSocialMediaChange }) => {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-base font-medium text-gray-900">
          Organizer Information
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Provide details about who is organizing this event
        </p>
      </div>

      <div>
        <label
          htmlFor="organizerName"
          className="block text-sm font-medium text-gray-700"
        >
          Organizer Name
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaUser className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            id="organizerName"
            name="organizerName"
            value={formData.organizerName || ""}
            onChange={onChange}
            className={`pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.organizerName ? "border-red-300" : ""
            }`}
            placeholder="Company or individual name"
          />
        </div>
        {errors.organizerName && (
          <p className="mt-1 text-sm text-red-600">{errors.organizerName}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="organizerEmail"
          className="block text-sm font-medium text-gray-700"
        >
          Contact Email
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaEnvelope className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="email"
            id="organizerEmail"
            name="organizerEmail"
            value={formData.organizerEmail || ""}
            onChange={onChange}
            className={`pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              errors.organizerEmail ? "border-red-300" : ""
            }`}
            placeholder="contact@example.com"
          />
        </div>
        {errors.organizerEmail && (
          <p className="mt-1 text-sm text-red-600">{errors.organizerEmail}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="organizerPhone"
          className="block text-sm font-medium text-gray-700"
        >
          Contact Phone
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaPhone className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="tel"
            id="organizerPhone"
            name="organizerPhone"
            value={formData.organizerPhone || ""}
            onChange={onChange}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="organizerWebsite"
          className="block text-sm font-medium text-gray-700"
        >
          Website
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaGlobe className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="url"
            id="organizerWebsite"
            name="organizerWebsite"
            value={formData.organizerWebsite || ""}
            onChange={onChange}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Social Media</h3>
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFacebook className="h-4 w-4 text-blue-600" />
            </div>
            <input
              type="url"
              id="facebook"
              value={formData.socialMedia?.facebook || ""}
              onChange={(e) => onSocialMediaChange("facebook", e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Facebook URL"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaTwitter className="h-4 w-4 text-blue-400" />
            </div>
            <input
              type="url"
              id="twitter"
              value={formData.socialMedia?.twitter || ""}
              onChange={(e) => onSocialMediaChange("twitter", e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Twitter URL"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaInstagram className="h-4 w-4 text-pink-600" />
            </div>
            <input
              type="url"
              id="instagram"
              value={formData.socialMedia?.instagram || ""}
              onChange={(e) => onSocialMediaChange("instagram", e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Instagram URL"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLinkedin className="h-4 w-4 text-blue-700" />
            </div>
            <input
              type="url"
              id="linkedin"
              value={formData.socialMedia?.linkedin || ""}
              onChange={(e) => onSocialMediaChange("linkedin", e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="LinkedIn URL"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaYoutube className="h-4 w-4 text-red-600" />
            </div>
            <input
              type="url"
              id="youtube"
              value={formData.socialMedia?.youtube || ""}
              onChange={(e) => onSocialMediaChange("youtube", e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="YouTube URL"
            />
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Add social media links to help attendees connect with you.
        </p>
      </div>
    </div>
  )
}

export default OrganizerForm
