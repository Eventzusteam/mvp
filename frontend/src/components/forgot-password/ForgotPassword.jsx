import React, { useState } from "react"
import { motion } from "framer-motion"
import { Mail, ArrowRight, KeyRound } from "lucide-react"
import { Link } from "react-router-dom"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      )

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setIsSubmitted(true)
    } catch (error) {
      console.error("Error sending reset email:", error)
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
              {isSubmitted ? "Check your email" : "Forgot password?"}
            </h1>
            <p className="text-gray-700 mb-8">
              {isSubmitted
                ? "We've sent you instructions to reset your password"
                : "Enter your email address and we'll send you instructions to reset your password"}
            </p>
          </motion.div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
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
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-4xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
                >
                  <ArrowRight
                    size={18}
                    className="mr-2"
                  />
                  Send reset instructions
                </button>
              </motion.div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center p-8 border border-blue-100 bg-blue-50 rounded-lg"
            >
              <KeyRound
                size={48}
                className="mx-auto mb-4 text-blue-600"
              />
              <p className="text-gray-700 mb-4">
                We've sent reset instructions to <strong>{email}</strong>.
                Please check your inbox and follow the link to reset your
                password.
              </p>
              <p className="text-sm text-gray-500">
                If you don't see the email, check your spam folder or{" "}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  click here to try again
                </button>
              </p>
            </motion.div>
          )}

          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="text-sm text-gray-800">
              Remembered your password?{" "}
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
              "url('https://source.unsplash.com/random/1200x900/?security')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-blue-900 bg-opacity-70"></div>
        </motion.div>

        {/* Option 2: Solid Color Background (commented out) */}
        {/* 
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        */}

        {/* SVG Illustration overlay */}
        <div className="absolute inset-0 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="w-3/4 max-w-md"
          >
            <img
              src="/ForgotPassword.svg"
              alt="Security illustration"
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
              Password Recovery
            </h2>
            <p className="text-lg text-black drop-shadow-md bg-opacity-30 p-3 rounded-lg">
              Don't worry, it happens to the best of us. We'll help you regain
              access to your account quickly and securely.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword
