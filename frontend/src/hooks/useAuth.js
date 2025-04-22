import { useContext } from "react"
import { AuthContext } from "../context/AuthContextDefinition"

/**
 * Custom hook to access the authentication context.
 * Provides an easy way for components to get user data and auth functions.
 */
const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default useAuth
