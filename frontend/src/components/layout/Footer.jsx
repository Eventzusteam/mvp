import React, { useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Facebook,
  ArrowUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

const Footer = () => {
  const [expandedSection, setExpandedSection] = useState(null)

  const footerSections = [
    {
      id: "quick-links",
      title: "Quick Links",
      links: [
        { name: "Home", path: "/" },
        { name: "All Events", path: "/events" },
        { name: "Create Event", path: "/events/create" },
        { name: "Contact", path: "/contact" },
      ],
    },
    {
      id: "resources",
      title: "Resources",
      links: [
        { name: "FAQ", path: "/faq" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms & Conditions", path: "/terms" },
      ],
    },
    {
      id: "contact",
      title: "Contact Us",
      isContact: true,
      content: [
        {
          icon: <MapPin size={16} />,
          text: "123 Event Street, City, ST 12345",
        },
        {
          icon: <Phone size={16} />,
          text: "(123) 456-7890",
          link: "tel:+1234567890",
        },
        {
          icon: <Mail size={16} />,
          text: "info@eventpro.com",
          link: "mailto:info@eventpro.com",
        },
      ],
    },
  ]

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id)
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Top section with logo and scroll-to-top */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/"
            className="flex items-center"
          >
            <img
              src="/logo.png"
              alt="EventPro"
              className="h-8 w-auto"
            />
          </Link>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-blue-600 hover:bg-blue-500 rounded-full shadow-lg transition-colors duration-300"
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} />
          </motion.button>
        </div>

        {/* Mobile accordion sections */}
        <div className="md:hidden space-y-2">
          {footerSections.map((section) => (
            <div
              key={section.id}
              className="border-b border-blue-700/50 pb-2"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="flex justify-between items-center w-full py-2 text-left font-medium"
                aria-expanded={expandedSection === section.id}
                aria-controls={`content-${section.id}`}
              >
                {section.title}
                {expandedSection === section.id ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              <AnimatePresence>
                {expandedSection === section.id && (
                  <motion.div
                    id={`content-${section.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {section.isContact ? (
                      <ul className="space-y-2 py-2 pl-2">
                        {section.content.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-center text-sm text-blue-100"
                          >
                            <span className="mr-2 text-blue-300">
                              {item.icon}
                            </span>
                            {item.link ? (
                              <a
                                href={item.link}
                                className="hover:text-blue-200"
                              >
                                {item.text}
                              </a>
                            ) : (
                              <span>{item.text}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="space-y-2 py-2 pl-2">
                        {section.links.map((link, i) => (
                          <li key={i}>
                            <Link
                              to={link.path}
                              className="text-sm text-blue-100 hover:text-blue-200"
                              onClick={() => setExpandedSection(null)}
                            >
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Desktop footer content */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 mb-6">
          <div className="col-span-1">
            <p className="text-blue-100 text-sm max-w-xs mb-4">
              Creating memorable events made simple. Find, organize, and manage
              your events all in one place.
            </p>
          </div>

          {footerSections.map((section) => (
            <div
              key={section.id}
              className="col-span-1"
            >
              <h3 className="text-base font-semibold mb-3">{section.title}</h3>

              {section.isContact ? (
                <ul className="space-y-2">
                  {section.content.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center text-sm text-blue-100"
                    >
                      <span className="mr-2 text-blue-300">{item.icon}</span>
                      {item.link ? (
                        <a
                          href={item.link}
                          className="hover:text-blue-200"
                        >
                          {item.text}
                        </a>
                      ) : (
                        <span>{item.text}</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <motion.div
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          to={link.path}
                          className="text-sm text-blue-100 hover:text-blue-200"
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Social icons and copyright - visible on all screens */}
        <div className="pt-4 border-t border-white flex flex-col sm:flex-row justify-between items-center">
          <div className="flex space-x-3 mb-3 sm:mb-0">
            {[
              {
                icon: <Instagram size={16} />,
                label: "Instagram",
                url: "https://instagram.com",
              },
              {
                icon: <Twitter size={16} />,
                label: "Twitter",
                url: "https://twitter.com",
              },
              {
                icon: <Facebook size={16} />,
                label: "Facebook",
                url: "https://facebook.com",
              },
            ].map((social, idx) => (
              <motion.a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-800 hover:bg-blue-600 rounded-full transition-colors duration-300"
                whileHover={{ y: -2 }}
                aria-label={social.label}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
          <p className="text-blue-200 text-xs text-center">
            © {new Date().getFullYear()} EventZus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
