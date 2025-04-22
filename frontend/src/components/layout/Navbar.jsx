import React, { useState, useEffect, useContext } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Phone, // Re-add Phone icon import
  Menu,
  X,
  Calendar,
  Users,
  LogIn,
  HelpCircle,
  User,
  LogOut,
  ChevronDown,
  Search,
} from "lucide-react"
import { AuthContext } from "../../context/AuthContextDefinition.js"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Use AuthContext instead of local state for user authentication
  const { user, logout, isAuthenticated } = useContext(AuthContext)

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      await logout() // Use the logout function from AuthContext

      // Close menus
      setIsUserMenuOpen(false)
      setIsOpen(false)

      // Redirect to home page
      navigate("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  // Base menu items (always visible or conditionally shown based on context, but not auth)
  const baseMenuItems = [
    {
      id: 1,
      title: "Create Event",
      path: "/events/create",
      icon: <Calendar size={18} />,
    },
    {
      id: 2,
      title: "All Events",
      path: "/events",
      icon: <Users size={18} />,
    },
    {
      id: 3, // Adjust ID if needed
      title: "Contact", // Add Contact item
      path: "/contact", // Add path for Contact
      icon: <Phone size={18} />, // Add Phone icon
    },
    {
      id: 4, // Adjust ID
      title: "FAQ",
      path: "/faq",
      icon: <HelpCircle size={18} />,
    },
  ]

  // User dropdown menu items (only shown when logged in)
  const userDropdownItems = [
    {
      id: 1,
      title: "My Dashboard",
      path: "/organizer/events", // Correct path for dashboard
      icon: <User size={16} />, // Use User icon for dashboard
    },
    {
      id: 2,
      title: "Create Event",
      path: "/events/create",
      icon: <Calendar size={16} />,
    },
    {
      id: 3,
      title: "Logout",
      action: handleLogout,
      icon: <LogOut size={16} />,
    },
  ]

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Close menu when a link is clicked
  const handleLinkClick = () => {
    setIsOpen(false)
    setIsUserMenuOpen(false)
  }

  // Toggle user dropdown
  const toggleUserMenu = (e) => {
    e.stopPropagation()
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false)
    }

    if (isUserMenuOpen) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [isUserMenuOpen])

  // Close mobile menu when screen resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [isOpen])

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black shadow-md py-2" : "bg-black backdrop-blur-md py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="flex items-center"
            >
              <img
                src="/logo.png"
                alt="EventPro"
                className="h-10 md:h-10 w-auto"
              />
            </Link>
          </div>

          {/* Search Bar (disabled) */}
          <div className="hidden md:block flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                className="bg-gray-900 border border-gray-700 text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-600 w-full text-sm transition-all cursor-not-allowed"
                disabled
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search
                  size={16}
                  className="text-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Base Menu Items */}
            {baseMenuItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-2 font-medium transition-colors duration-200 ${
                  location.pathname === item.path ? "font-bold " : ""
                }${
                  scrolled
                    ? "text-white hover:text-blue-600"
                    : "text-white hover:text-blue-600"
                }`}
                onClick={handleLinkClick}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}

            {/* Auth Section */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className={`flex items-center gap-2 font-medium transition-colors duration-200 ${
                    scrolled
                      ? "text-white hover:text-blue-600"
                      : "text-white hover:text-blue-600"
                  }`}
                >
                  <User size={18} />
                  <span>{user.name || user.email}</span>{" "}
                  {/* Display user name or email */}
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700"
                      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                      {userDropdownItems.map((item) =>
                        item.action ? (
                          <button
                            key={item.id}
                            onClick={() => {
                              item.action()
                              handleLinkClick() // Close menu after action
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white gap-2"
                          >
                            {item.icon}
                            {item.title}
                          </button>
                        ) : (
                          <Link
                            key={item.id}
                            to={item.path}
                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white gap-2"
                            onClick={handleLinkClick}
                          >
                            {item.icon}
                            {item.title}
                          </Link>
                        )
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/signin"
                className={`flex items-center gap-2 font-medium transition-colors duration-200 ${
                  scrolled
                    ? "text-white hover:text-blue-600"
                    : "text-white hover:text-blue-600"
                }`}
                onClick={handleLinkClick}
              >
                <LogIn size={18} />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black bg-opacity-90 backdrop-blur-sm absolute top-full left-0 w-full overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {/* Mobile Search (disabled) */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events..."
                  className="bg-gray-800 border border-gray-700 text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-600 w-full text-sm transition-all cursor-not-allowed"
                  disabled
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search
                    size={16}
                    className="text-blue-500"
                  />
                </div>
              </div>

              {/* Base Menu Items */}
              {baseMenuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-3 py-2 text-white hover:text-blue-500 transition-colors duration-200 ${
                    location.pathname === item.path
                      ? "font-semibold text-blue-400"
                      : ""
                  }`}
                  onClick={handleLinkClick}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}

              {/* Divider */}
              <hr className="border-gray-700 my-2" />

              {/* Auth Section - Mobile */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center justify-between w-full py-2 text-white hover:text-blue-500 transition-colors duration-200"
                  >
                    <span className="flex items-center gap-3">
                      <User size={18} />
                      {user.name || user.email}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {/* Mobile User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="pl-6 mt-1 flex flex-col space-y-2">
                      {userDropdownItems.map((item) =>
                        item.action ? (
                          <button
                            key={item.id}
                            onClick={() => {
                              item.action()
                              handleLinkClick() // Close menu after action
                            }}
                            className="flex items-center w-full py-1 text-sm text-gray-300 hover:text-blue-400 gap-2"
                          >
                            {item.icon}
                            {item.title}
                          </button>
                        ) : (
                          <Link
                            key={item.id}
                            to={item.path}
                            className="flex items-center py-1 text-sm text-gray-300 hover:text-blue-400 gap-2"
                            onClick={handleLinkClick}
                          >
                            {item.icon}
                            {item.title}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/signin"
                  className="flex items-center gap-3 py-2 text-white hover:text-blue-500 transition-colors duration-200"
                  onClick={handleLinkClick}
                >
                  <LogIn size={18} />
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
