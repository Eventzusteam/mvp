import React, { useState } from "react"
import { motion } from "framer-motion"
import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link,
  Check,
} from "lucide-react"

const EventShare = ({ eventId, title }) => {
  const [copied, setCopied] = useState(false)

  const shareUrl = `${window.location.origin}/events/${eventId}`
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(shareUrl)

  const socialLinks = [
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <Facebook size={18} />,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: <Twitter size={18} />,
      color: "bg-sky-500 hover:bg-sky-600",
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <Linkedin size={18} />,
      color: "bg-blue-700 hover:bg-blue-800",
    },
    {
      name: "Email",
      url: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      icon: <Mail size={18} />,
      color: "bg-gray-600 hover:bg-gray-700",
    },
  ]

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Share2
          size={20}
          className="mr-2 text-blue-600"
        />
        Share Event
      </h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {socialLinks.map((link, index) => (
          <motion.a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className={`${link.color} text-white p-2 rounded-full transition-colors`}
            title={`Share on ${link.name}`}
          >
            {link.icon}
          </motion.a>
        ))}
      </div>

      <div className="mt-4">
        <div className="relative">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
          />
          <button
            onClick={copyToClipboard}
            className="absolute right-0 top-0 h-full px-3 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check size={18} /> : <Link size={18} />}
          </button>
        </div>
        {copied && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-green-600 mt-1"
          >
            Link copied to clipboard!
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}

export default EventShare
