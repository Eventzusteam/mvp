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

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
    })

    res.json({
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Login failed" })
  }
})

// Refresh Access Token - UPDATED to include user ID
router.options("/refresh-token", cors(corsOptions))
router.post("/refresh-token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) return res.status(401).json({ error: "Access denied" })

  try {
    // Verify the refresh token with the correct secret
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

    // Check if token exists in database
    const tokenDoc = await Token.findOne({ token: refreshToken })
    if (!tokenDoc) {
      return res.status(403).json({ error: "Invalid refresh token" })
    }

    // Get user info to include in response
    const user = await User.findById(decoded.id).select("-password")
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Generate new access token
    const accessToken = generateAccessToken(user)

    res.json({
      accessToken,
      userId: decoded.id,
    })
  } catch (error) {
    console.error("Refresh token error:", error)
    return res.status(403).json({ error: "Invalid refresh token" })
  }
})

// Logout User - Clears refresh token from cookies & database
router.post("/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken)
      return res.status(200).json({ message: "Logged out successfully" })

    // Delete refresh token from the database
    await Token.deleteOne({ token: refreshToken })

    // Clear cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    res.status(200).json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)
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

export default router
