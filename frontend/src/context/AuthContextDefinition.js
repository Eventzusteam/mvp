import { createContext } from "react"

/**
 * Defines the AuthContext.
 * Separated to allow AuthProvider to be in its own file,
 * resolving potential Fast Refresh issues.
 */
export const AuthContext = createContext()
