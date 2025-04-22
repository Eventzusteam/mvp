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
import {
  csrfProtection,
  validateCsrfToken,
} from "./middleware/csrfMiddleware.js"

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

// CORS Configuration (More Secure & Explicit)
const clientUrl = process.env.CLIENT_URL
const allowedOrigins = clientUrl
  ? clientUrl.split(",").map((url) => url.trim()) // Trim whitespace
  : ["http://localhost:5173"]

console.log("Allowed Origins for CORS:", allowedOrigins) // Log allowed origins on startup

const isProduction = process.env.NODE_ENV === "production"

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an origin (like Postman/curl) OR if the origin is in the allowed list.
    // Browsers might send 'null' for direct access, which !origin doesn't catch.
    // Explicitly allow if origin is undefined/null OR in the allowed list.
    if (!origin || allowedOrigins.includes(origin)) {
      console.log(`Allowing CORS for origin: ${origin || 'undefined/null'}`)
      return callback(null, true)
    } else {
      console.error(
        `Blocked by CORS: Origin '${origin}' not in allowed list: [${allowedOrigins.join(
          ", "
        )}]`
      )
      return callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Ensure OPTIONS is present
  allowedHeaders: ["Content-Type", "Authorization", "Cookie", "x-csrf-token"], // Ensure necessary headers are allowed
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Handle OPTIONS requests explicitly for preflight checks
// The 'cors' middleware usually handles this, but being explicit can sometimes help.
app.options("*", cors(corsOptions)) // Enable preflight across-the-board

app.use(cookieParser()) // Needs to be before CORS if credentials are used
app.use(cors(corsOptions)) // Apply CORS settings to other requests

app.use(express.json())

// Debug: Log cookies after parsing
app.use((req, res, next) => {
  // console.log(`[Cookie Parser Debug] Path: ${req.path}, Cookies:`, req.cookies) // Removed log
  next()
})
app.use(morgan("dev"))

// CSRF Protection will be applied selectively in routes
// app.use(csrfProtection) // Removed global application

//Routes
app.use("/api/auth", authRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/contact", contactRoutes)

// New Testing Route
app.get("/api/test", (req, res) => {
  res.status(200).json({
    message: "Server is up and running!",
    timestamp: new Date().toISOString(),
    status: "healthy",
  })
})

//Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err)
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  })
})

const PORT = process.env.PORT || 5000

//Server Listening
try {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    // console.log(`Database Connection: ${process.env.MONGO_URI}`) // Removed potentially sensitive log
  })
} catch (error) {
  console.error("Failed to start server:", error)
  process.exit(1)
}

// Add global error handler
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason)
})
