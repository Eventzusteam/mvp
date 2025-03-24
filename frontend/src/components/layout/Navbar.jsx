import React, { useState, useEffect, useContext } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Phone,
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
import { AuthContext } from "../../context/AuthContext"

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

  // Enhanced menu items with icons for better visual identity
  const menuItems = [
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
      id: 3,
      title: "FAQ",
      path: "/faq",
      icon: <HelpCircle size={18} />,
    },
  ]

  // Add Sign In item only if not logged in
  if (!isAuthenticated) {
    menuItems.push({
      id: 4,
      title: "Sign In",
      path: "/signin",
      icon: <LogIn size={18} />,
    })
  }

  // User dropdown menu items (only shown when logged in)
  const userDropdownItems = [
    {
      id: 1,
      title: "Create Event",
      path: "/events/create",
      icon: <Calendar size={16} />,
    },
    {
      id: 2,
      title: isAuthenticated && user ? "My Dashboard" : "Browse Events",
      path: isAuthenticated && user ? "/organizer/events" : "/events",
      icon: <Users size={16} />,
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
            {menuItems.map((item) => (
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

            {/* User profile dropdown if logged in */}
            {isAuthenticated && user && (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className={`flex items-center gap-2 font-medium transition-colors duration-200 ${
                    scrolled
                      ? "text-white hover:text-blue-600"
                      : "text-white hover:text-blue-600"
                  }`}
                  aria-label="User menu"
                >
                  <User size={20} />
                  <span className="text-white">{user.name}</span>
                  {/* <ChevronDown size={16} /> */}
                </button>

                {/* User dropdown menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {userDropdownItems.map((item) => (
                        <div key={item.id}>
                          {item.action ? (
                            <button
                              onClick={item.action}
                              className="w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 flex items-center gap-2"
                            >
                              {item.icon}
                              {item.title}
                            </button>
                          ) : (
                            <Link
                              to={item.path}
                              className="block px-4 py-2 text-gray-800 hover:bg-blue-50 flex items-center gap-2"
                              onClick={handleLinkClick}
                            >
                              {item.icon}
                              {item.title}
                            </Link>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Phone icon for contact with clickable link */}
            <Link
              to="/contact"
              className={`transition-colors duration-200 p-2 rounded-full ${
                location.pathname === "/contact" ? "bg-blue-700 " : ""
              }${
                scrolled
                  ? "text-white hover:text-blue-800 hover:bg-blue-100"
                  : "text-white hover:text-blue-800 hover:bg-blue-100"
              }`}
              onClick={handleLinkClick}
              aria-label="Contact"
            >
              <Phone size={20} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className={scrolled ? "text-white" : "text-white"}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Improved version */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-black shadow-lg md:hidden"
          >
            <div className="flex flex-col px-4 py-3 space-y-2 border-t border-gray-800">
              {/* Mobile Search Bar */}
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Search events..."
                  className="bg-gray-900 border border-gray-700 text-white pl-10 pr-4 py-2 rounded-full w-full focus:outline-none focus:ring-1 focus:ring-blue-600 text-sm"
                  disabled
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search
                    size={16}
                    className="text-blue-500"
                  />
                </div>
              </div>

              {/* User profile section if logged in */}
              {isAuthenticated && user && (
                <div className="mb-2 py-2 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-700 rounded-full p-1.5">
                      <User
                        size={18}
                        className="text-white"
                      />
                    </div>
                    <div>
                      <div className="text-white font-medium">{user.name}</div>
                      <div className="text-gray-400 text-sm">{user.email}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile menu items */}
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-3 py-2 text-white font-medium ${
                    location.pathname === item.path
                      ? "text-blue-400"
                      : "hover:text-blue-300"
                  }`}
                  onClick={handleLinkClick}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}

              {/* User options in mobile when logged in */}
              {isAuthenticated && (
                <div className="pt-2 border-t border-gray-800">
                  <div className="text-gray-400 text-sm mb-2">User Options</div>
                  {userDropdownItems.map((item) =>
                    item.action ? (
                      <button
                        key={item.id}
                        onClick={item.action}
                        className="flex items-center gap-3 py-2 w-full text-left text-white hover:text-blue-300 font-medium"
                      >
                        {item.icon}
                        {item.title}
                      </button>
                    ) : (
                      <Link
                        key={item.id}
                        to={item.path}
                        className={`flex items-center gap-3 py-2 text-white font-medium ${
                          location.pathname === item.path
                            ? "text-blue-400"
                            : "hover:text-blue-300"
                        }`}
                        onClick={handleLinkClick}
                      >
                        {item.icon}
                        {item.title}
                      </Link>
                    )
                  )}
                </div>
              )}

              {/* Contact link */}
              <Link
                to="/contact"
                className={`flex items-center gap-3 py-2 text-white font-medium ${
                  location.pathname === "/contact"
                    ? "text-blue-400"
                    : "hover:text-blue-300"
                }`}
                onClick={handleLinkClick}
              >
                <Phone size={18} />
                Contact Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
