import React, { useContext, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContextDefinition.js"

const SignIn = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const { login, isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/") // Redirect if already logged in
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await login(email, password)
      navigate("/") // Redirect after login
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full">
      {/* Left side - Form */}
      <motion.div
        className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-md mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2 text-gray-900">
              Welcome back
            </h1>
            <p className="text-gray-700 mb-8">Please sign in to your account</p>
          </motion.div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
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
              className="mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
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
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-800"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-700 hover:text-blue-600"
                >
                  Forgot your password?
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
              >
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    <LogIn
                      size={18}
                      className="mr-2"
                    />
                    Sign in
                  </>
                )}
              </button>
            </motion.div>
          </form>

          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <p className="text-sm text-gray-800">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-blue-700 hover:text-blue-600"
              >
                Sign up
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
        {/*Background Image */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://source.unsplash.com/random/1200x900/?workspace')",
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
              src="/login.svg"
              alt="Workspace illustration"
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
              Your Workspace Awaits
            </h2>
            <p className="text-lg text-black drop-shadow-md bg-opacity-30 p-3 rounded-lg">
              Sign in to access your projects, collaborate with your team, and
              boost your productivity.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default SignIn
