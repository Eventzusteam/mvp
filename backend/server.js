import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import mongoSanitize from "express-mongo-sanitize"
import xss from "xss-clean"
import compression from "compression"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import eventRoutes from "./routes/eventRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"

dotenv.config()
connectDB()

const app = express()

//Security & Performance Middleware
app.use(helmet()) // Protects headers
app.use(mongoSanitize()) // Prevents NoSQL injection
app.use(xss()) // Prevents XSS attacks
app.use(compression()) // Reduces response size

//Rate Limiting: Prevent excessive requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increase the request limit
  message: { error: "Too many requests. Please try again later." },
})
app.use(limiter)

//CORS Configuration (More Secure)
const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL]
  : ["http://localhost:3000", "http://localhost:5173"]
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        console.error(`Blocked by CORS: ${origin}`)
        callback(new Error("CORS not allowed"))
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
)

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))

//Routes
app.use("/api/auth", authRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/contact", contactRoutes)

//Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err)
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  })
})

//Server Listening
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
