import React, { useContext, useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

const SignUp = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { login, register } = useContext(AuthContext)
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    // Validate password with regex
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters, include a number, a lowercase, an uppercase, and a special character."
      )
      setLoading(false)
      return
    }

    try {
      // Use the register function from AuthContext
      await register(name, email, password)

      // After successful registration, login the user
      await login(email, password)

      // Redirect to home page
      navigate("/")
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Form */}
      <motion.div
        className="w-full lg:w-1/2 p-4 md:p-8 flex flex-col justify-center overflow-y-auto"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-md mx-auto w-full py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2 text-gray-900">
              Create account
            </h1>
            <p className="text-gray-700 mb-6">Join us and get started today</p>
          </motion.div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            <motion.div
              className="mb-5"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User
                    size={18}
                    className="text-gray-500"
                  />
                </div>
                <input
                  id="name"
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            <motion.div
              className="mb-5"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail
                    size={18}
                    className="text-gray-500"
                  />
                </div>
                <input
                  id="email"
                  type="email"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            <motion.div
              className="mb-5"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    size={18}
                    className="text-gray-500"
                  />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff
                      size={18}
                      className="text-gray-500 hover:text-gray-700"
                    />
                  ) : (
                    <Eye
                      size={18}
                      className="text-gray-500 hover:text-gray-700"
                    />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div
              className="mb-5"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    size={18}
                    className="text-gray-500"
                  />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff
                      size={18}
                      className="text-gray-500 hover:text-gray-700"
                    />
                  ) : (
                    <Eye
                      size={18}
                      className="text-gray-500 hover:text-gray-700"
                    />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center mb-5"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-800"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="font-medium text-blue-700 hover:text-blue-600"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-medium text-blue-700 hover:text-blue-600"
                >
                  Privacy Policy
                </a>
              </label>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
              >
                {loading ? (
                  "Creating account..."
                ) : (
                  <>
                    <UserPlus
                      size={18}
                      className="mr-2"
                    />
                    Create account
                  </>
                )}
              </button>
            </motion.div>
          </form>

          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <p className="text-sm text-gray-800">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-medium text-blue-700 hover:text-blue-600"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Image/Color with SVG Illustration */}
      <motion.div
        className="hidden lg:block lg:w-1/2 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Option 1: Background Image (active by default) */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://source.unsplash.com/random/1200x900/?teamwork')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-blue-900 bg-opacity-70"></div>
        </motion.div>

        {/* SVG Illustration overlay */}
        <div className="absolute inset-0 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="w-3/4 max-w-md"
          >
            <img
              src="/register.svg"
              alt="Teamwork illustration"
              className="w-full h-auto drop-shadow-lg"
            />
          </motion.div>
        </div>

        {/* Text content */}
        <div className="absolute inset-0 flex flex-col justify-end items-center text-white p-12 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="max-w-md text-center"
          >
            <h2 className="text-3xl font-bold mb-4 text-black drop-shadow-lg">
              Join Our Community
            </h2>
            <p className="text-lg text-black drop-shadow-md bg-opacity-30 p-3 rounded-lg">
              Create an account to start collaborating, manage your projects,
              and take your productivity to the next level.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default SignUp
