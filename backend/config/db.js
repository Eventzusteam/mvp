import mongoose from "mongoose"

const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Avoid long connection failures
      socketTimeoutMS: 45000, // Improve socket stability
      autoIndex: true, // Enable indexing for better performance
      maxPoolSize: 10, // Optimize connection pooling
    })

    console.log("MongoDB connected successfully")
  } catch (error) {
    console.error("Database connection error:", error)

    if (retries === 0) {
      console.error("Max retries reached. Exiting...")
      process.exit(1) // Stops the app if DB connection fails
    }

    console.error(
      // Changed to console.error for actual errors
      `Retrying database connection in 5 seconds... (${retries} retries left)`
    )
    setTimeout(() => connectDB(retries - 1), 5000) // Retry after 5 seconds
  }
}

export default connectDB
