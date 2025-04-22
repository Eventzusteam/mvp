import fs from "fs"
import path from "path"
import multer from "multer"
import cloudinary from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Store files temporarily before uploading
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/"
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath) // Ensure upload folder exists
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)) // Unique filenames
  },
})

// File filter to ensure only images are uploaded
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Only image files are allowed!"), false)
  }
}

// Configure multer with size limits
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
})

// Function to upload file to Cloudinary
export const uploadToCloudinary = async (filePath) => {
  try {
    // Handle both file paths and base64 data URLs
    const uploadOptions = {
      folder: "event-management",
      use_filename: true,
      unique_filename: true,
      overwrite: true,
      resource_type: "auto",
    }

    // If it's a base64 data URL
    if (typeof filePath === "string" && filePath.startsWith("data:")) {
      // console.log("Uploading base64 image to Cloudinary") // Removed log
      const result = await cloudinary.v2.uploader.upload(
        filePath,
        uploadOptions
      )
      return result.secure_url
    }
    // If it's a file path
    else {
      // console.log("Uploading file path to Cloudinary:", filePath) // Removed log
      // Check if file exists before attempting upload
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`)
      }

      const result = await cloudinary.v2.uploader.upload(
        filePath,
        uploadOptions
      )

      // Delete local file after successful upload
      try {
        fs.unlinkSync(filePath)
      } catch (unlinkError) {
        console.error("Failed to delete local file:", unlinkError)
        // Continue execution even if file deletion fails
      }

      return result.secure_url
    }
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)

    // Try to clean up the file if the upload failed and it's a file path
    if (typeof filePath === "string" && !filePath.startsWith("data:")) {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      } catch (cleanupError) {
        console.error(
          "Failed to clean up file after upload error:",
          cleanupError
        )
      }
    }

    throw new Error("Failed to upload image")
  }
}
