import jwt from "jsonwebtoken"

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied: No token provided" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // Attach user info to request
    next()
  } catch (error) {
    return res.status(400).json({ error: "Invalid token" })
  }
}

// 🎯 NEW: Role-Based Middleware (RBAC)
export const roleMiddleware = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ error: "Forbidden: Insufficient permissions" })
  }
  next()
}

export default authMiddleware
