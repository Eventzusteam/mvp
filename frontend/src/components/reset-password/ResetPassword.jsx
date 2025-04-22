import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Eye, EyeOff, Lock, Check } from "lucide-react"
import { toast } from "react-toastify"

const ResetPassword = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const { token } = useParams()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate password with regex
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters, include a number, a lowercase, an uppercase, and a special character."
      )
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password")
      }

      setIsSuccess(true)
      toast.success("Password reset successful!")

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/signin")
      }, 3000)
    } catch (error) {
      setError(error.message)
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="w-full max-w-sm mx-auto lg:w-96">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {isSuccess ? "Password Reset Complete" : "Reset Your Password"}
            </h2>
          </div>

          {isSuccess ? (
            <div className="mt-8">
              <div className="p-4 rounded-md bg-green-50">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Check
                      className="w-5 h-5 text-green-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Your password has been reset successfully. Redirecting to
                      login page...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <div className="mt-6">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {error && (
                    <div className="p-4 rounded-md bg-red-50">
                      <div className="flex">
                        <div className="ml-3">
                          <p className="text-sm font-medium text-red-800">
                            {error}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock
                          className="w-5 h-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="block w-full pl-10 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter your new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          {showPassword ? (
                            <EyeOff
                              className="w-5 h-5"
                              aria-hidden="true"
                            />
                          ) : (
                            <Eye
                              className="w-5 h-5"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock
                          className="w-5 h-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className="block w-full pl-10 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="text-gray-400 hover:text-gray-500"
                        >
                          {showConfirmPassword ? (
                            <EyeOff
                              className="w-5 h-5"
                              aria-hidden="true"
                            />
                          ) : (
                            <Eye
                              className="w-5 h-5"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Resetting..." : "Reset Password"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="relative flex-1 hidden w-0 lg:block">
        <img
          className="absolute inset-0 object-cover w-full h-full"
          src="/ForgotPassword.svg"
          alt="Reset Password"
        />
      </div>
    </div>
  )
}

export default ResetPassword
