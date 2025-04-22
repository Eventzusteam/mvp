import express from "express"
import bcrypt from "bcryptjs"
import cors from "cors"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import nodemailer from "nodemailer"
import rateLimit from "express-rate-limit"
import User from "../models/User.js"
import Token from "../models/Token.js"
import authMiddleware from "../middleware/authMiddleware.js"
import { validateCsrfToken } from "../middleware/csrfMiddleware.js"

const router = express.Router()

const corsOptions = {
  origin: process.env.CLIENT_URL
    ? [process.env.CLIENT_URL]
    : ["http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  optionsSuccessStatus: 200,
}

// Function to generate access token
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: "15m", // Short-lived token for security
  })
}

// Function to generate refresh token
const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  )

  // Store refresh token in DB
  await Token.create({ userId: user._id, token: refreshToken })

  return refreshToken
}

// Limit login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 login attempts per 15 minutes
  message: { error: "Too many login attempts. Please try again later." },
})

// Register User
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body

  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Password must be at least 8 characters, include a number, a lowercase, an uppercase, and a special character.",
    })
  }

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.status(400).json({ error: "Email already in use" })

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashedPassword })

    res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Registration failed" })
  }
})

// Get CSRF Token
import { csrfProtection } from "../middleware/csrfMiddleware.js" // Import csrfProtection

router.get("/csrf-token", csrfProtection, (req, res) => {
  // Apply csrfProtection middleware here
  // The csrfProtection middleware should have already generated a token
  // and attached it via res.getToken or res.locals.csrfToken
  // If using csurf, it might be req.csrfToken()
  // Let's assume generateCsrfToken can be called directly if needed,
  // or rely on the middleware attached in server.js

  // Option 1: Rely on middleware attached in server.js (if it adds req.csrfToken() or similar)
  // const token = req.csrfToken ? req.csrfToken() : null;

  // Option 2: Use the generate function directly (might create inconsistencies if not careful)
  // const token = generateCsrfToken(req, res); // This might set cookies unexpectedly

  // Option 3: Access token from res.locals if set by middleware
  const token = res.locals.csrfToken || (res.getToken ? res.getToken() : null)

  if (token) {
    res.json({ csrfToken: token })
  } else {
    // Fallback: Generate if not available (ensure middleware setup is correct)
    console.error(
      "CSRF token not found in locals/getToken after csrfProtection middleware."
    )
    res
      .status(500)
      .json({ error: "CSRF token could not be generated or retrieved." })
  }
})

// Login User
router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: "Invalid credentials" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" })

    const accessToken = generateAccessToken(user)
    const refreshToken = await generateRefreshToken(user)

    // Set the cookie
    const isProduction = process.env.NODE_ENV === "production"

    const cookieOptions = {
      httpOnly: true,
      secure: true, // Enforce Secure=true because SameSite=None is used
      sameSite: "None", // Use None consistently for cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
      path: "/", // Ensure path is root
    }

    res.cookie("refreshToken", refreshToken, cookieOptions)

    // Send the response
    res.json({
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (error) {
    console.error("[Login] Error during login process:", error)
    res.status(500).json({ error: "Login failed" })
  }
})

// Refresh Access Token - UPDATED to include user ID and handle token rotation
router.options("/refresh-token", cors(corsOptions))
router.post("/refresh-token", validateCsrfToken, async (req, res) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken)
    return res.status(401).json({ error: "Access denied", code: "NO_TOKEN" })

  try {
    // Verify the refresh token with the correct secret
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

    // Check if token exists in database
    const tokenDoc = await Token.findOne({ token: refreshToken })
    if (!tokenDoc) {
      const clearCookieOptions = {
        httpOnly: true,
        secure: true, // Enforce Secure=true because SameSite=None is used
        sameSite: "None", // Use None consistently
        path: "/",
      }
      // Clear the invalid cookie
      res.clearCookie("refreshToken", clearCookieOptions)
      console.error(
        "[Refresh Token] Error: Token not found in DB. Sending 403."
      )
      return res
        .status(403)
        .json({ error: "Invalid refresh token", code: "INVALID_TOKEN_DB" })
    }

    // Get user info to include in response
    const user = await User.findById(decoded.id).select("-password")
    if (!user) {
      const clearCookieOptions = {
        httpOnly: true,
        secure: true, // Enforce Secure=true because SameSite=None is used
        sameSite: "None", // Use None consistently
        path: "/",
      }
      // Clear the invalid cookie and delete token from DB
      await Token.deleteOne({ token: refreshToken })
      res.clearCookie("refreshToken", clearCookieOptions)
      console.error(
        "[Refresh Token] Error: User associated with token not found. Sending 404."
      )
      return res
        .status(404)
        .json({ error: "User not found", code: "USER_NOT_FOUND" })
    }

    // Generate new access token
    const accessToken = generateAccessToken(user)

    // Token rotation for better security - generate a new refresh token
    // Delete the old refresh token
    await Token.deleteOne({ token: refreshToken })

    // Generate a new refresh token
    const newRefreshToken = await generateRefreshToken(user)

    const refreshCookieOptions = {
      httpOnly: true,
      secure: true, // Enforce Secure=true because SameSite=None is used
      sameSite: "None", // Use None consistently for cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
      path: "/",
    }
    // Set the new refresh token in a cookie
    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions)

    res.json({
      accessToken,
      userId: decoded.id, // Keep sending userId for frontend context
      // user: { id: user._id, name: user.name, email: user.email }, // Optionally send user details
    })
  } catch (error) {
    console.error(
      "[Refresh Token] Error caught during token refresh process:",
      error
    )

    const errorClearCookieOptions = {
      httpOnly: true,
      secure: true, // Enforce Secure=true because SameSite=None is used
      sameSite: "None", // Consistent setting for cross-origin
      path: "/",
    }
    // Clear potentially invalid/expired cookie
    res.clearCookie("refreshToken", errorClearCookieOptions)
    console.log(
      "[Refresh Token] Cleared potentially invalid refresh token cookie due to caught error."
    )

    if (error.name === "TokenExpiredError") {
      console.error("[Refresh Token] TokenExpiredError detected. Sending 401.")
      // Clear the cookie regardless of DB deletion success
      res.clearCookie("refreshToken", errorClearCookieOptions)
      console.log(
        "[Refresh Token] Cleared expired refresh token cookie (in TokenExpiredError block)."
      )

      // Attempt to delete the expired token from DB if possible (might fail if already deleted)
      try {
        const decodedExpired = jwt.decode(refreshToken) // Decode without verification
        if (decodedExpired && decodedExpired.id) {
          await Token.deleteOne({
            userId: decodedExpired.id,
            token: refreshToken,
          })
          console.log(
            "[Refresh Token] Successfully deleted expired token entry from DB."
          )
        }
      } catch (dbError) {
        console.error(
          "[Refresh Token] Error deleting expired token from DB:",
          dbError.message
        )
      }
      return res
        .status(401)
        .json({ error: "Refresh token expired", code: "REFRESH_TOKEN_EXPIRED" })
    } else if (error.name === "JsonWebTokenError") {
      console.error("[Refresh Token] JsonWebTokenError detected. Sending 401.")
      return res
        .status(401)
        .json({ error: "Invalid refresh token", code: "INVALID_REFRESH_TOKEN" })
    } else {
      console.error("[Refresh Token] Generic error caught. Sending 500.")
      return res
        .status(500)
        .json({ error: "Internal server error", code: "REFRESH_FAILED" })
    }
  }
})

// Logout User - Clears refresh token from cookies & database
router.post("/logout", validateCsrfToken, async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      console.log(
        "[Logout] No refresh token found in cookies. Already logged out or token missing."
      )
      return res.status(200).json({ message: "Logged out successfully" })
    }

    // Delete refresh token from the database
    await Token.deleteOne({ token: refreshToken })

    const logoutClearCookieOptions = {
      httpOnly: true,
      secure: true, // Enforce Secure=true because SameSite=None is used
      sameSite: "None", // Use None consistently
      path: "/",
    }
    // Clear cookie
    res.clearCookie("refreshToken", logoutClearCookieOptions)

    res.status(200).json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("[Logout] Error during logout process:", error)
    res.status(500).json({ error: "Logout failed" })
  }
})

// Get current user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) return res.status(404).json({ error: "User not found" })

    res.json(user)
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Forgot Password - Send Reset Email
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ error: "User not found" })

    const resetToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex")

    user.resetPasswordToken = hashedToken
    user.resetPasswordExpires = Date.now() + 3600000 // 1 hour expiration
    await user.save()

    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: `Click this link to reset your password: ${process.env.CLIENT_URL}/reset-password/${resetToken}`,
    }

    await transporter.sendMail(mailOptions)
    res.status(200).json({ message: "Password reset email sent" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error sending password reset email" })
  }
})

// Reset Password - Update Password
router.post("/reset-password/:token", async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex")

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user)
      return res.status(400).json({ error: "Invalid or expired token" })

    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    res.status(200).json({ message: "Password reset successful" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error resetting password" })
  }
})

// router.get("/me", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password")
//     if (!user) return res.status(404).json({ error: "User not found" })

//     res.json(user)
//   } catch (error) {
//     console.error("Get user error:", error)
//     res.status(500).json({ error: "Server error" })
//   }
// })

// 🎯 NEW: Route to provide CSRF token to the frontend
router.get("/csrf-token", (req, res) => {
  // The csrfProtection middleware should have already generated a token
  // and attached a method to retrieve it.
  if (res.getToken) {
    res.json({ csrfToken: res.getToken() })
  } else {
    // Fallback or error if token generation failed in middleware
    console.error("CSRF token could not be generated or retrieved.")
    res.status(500).json({ error: "Failed to generate CSRF token" })
  }
})

export default router
