import express from "express"
import nodemailer from "nodemailer"
import rateLimit from "express-rate-limit"
import validator from "validator"

const router = express.Router()
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 requests
  message: { error: "Too many messages sent. Please try again later." },
})

// Using the default route to match the frontend
router.post("/", contactLimiter, async (req, res) => {
  const { name, email, phone, message } = req.body

  // Validate Inputs
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" })
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" })
  }
  if (message.length < 10 || message.length > 1000) {
    return res
      .status(400)
      .json({ error: "Message must be between 10 and 1000 characters" })
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 587,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECEIVING_EMAIL,
    subject: "New Contact Form Submission",
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${
      phone || "Not provided"
    }\nMessage: ${message}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    res.status(200).json({ message: "Message sent successfully" })
  } catch (error) {
    console.error("Email send error:", error)
    res.status(500).json({ error: "Failed to send message" })
  }
})

export default router
