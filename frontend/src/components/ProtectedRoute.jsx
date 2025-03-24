import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext)

  // Show loading indicator while checking authentication status
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-blue-600">Loading...</div>
      </div>
    )
  }

  // Only redirect if we've finished loading and user is not authenticated
  return user ? children : <Navigate to="/signin" />
}

export default ProtectedRoute
