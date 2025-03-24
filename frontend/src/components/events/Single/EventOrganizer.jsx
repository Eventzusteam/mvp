import React from "react"
import { motion } from "framer-motion"
import {
  User,
  Mail,
  Phone,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react"

const EventOrganizer = ({ organizer }) => {
  const { name, email, phone, website, socialMedia } = organizer

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-xl font-bold mb-4">Event Organizer</h2>

      <div className="space-y-4">
        {name && (
          <div className="flex items-center">
            <User
              size={18}
              className="text-blue-600 mr-3"
            />
            <div>
              <div className="text-sm text-gray-500">Organizer</div>
              <div className="font-medium">{name}</div>
            </div>
          </div>
        )}

        {email && (
          <div className="flex items-center">
            <Mail
              size={18}
              className="text-blue-600 mr-3"
            />
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <a
                href={`mailto:${email}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {email}
              </a>
            </div>
          </div>
        )}

        {phone && (
          <div className="flex items-center">
            <Phone
              size={18}
              className="text-blue-600 mr-3"
            />
            <div>
              <div className="text-sm text-gray-500">Phone</div>
              <a
                href={`tel:${phone}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {phone}
              </a>
            </div>
          </div>
        )}

        {website && (
          <div className="flex items-center">
            <Globe
              size={18}
              className="text-blue-600 mr-3"
            />
            <div>
              <div className="text-sm text-gray-500">Website</div>
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline"
              >
                {website}
              </a>
            </div>
          </div>
        )}

        {/* Social Media Links */}
        {socialMedia && Object.values(socialMedia).some((link) => link) && (
          <div className="pt-2">
            <div className="text-sm text-gray-500 mb-2">Social Media</div>
            <div className="flex space-x-3">
              {socialMedia.facebook && (
                <a
                  href={socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Facebook size={20} />
                </a>
              )}
              {socialMedia.twitter && (
                <a
                  href={socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Twitter size={20} />
                </a>
              )}
              {socialMedia.instagram && (
                <a
                  href={socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Instagram size={20} />
                </a>
              )}
              {socialMedia.linkedin && (
                <a
                  href={socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Linkedin size={20} />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default EventOrganizer
