import React, { useRef, useState } from "react"
import { Upload } from "lucide-react"

export default function Hero({ onImageUpload }) {
  const ref = useRef(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [error, setError] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  // In the handleImageUpload function of Hero.jsx:

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setPreviewImage(URL.createObjectURL(file))
    setIsUploading(true)
    setError(null)

    const uploadUrl = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    if (!uploadUrl || !uploadPreset) {
      setError("Configuration error. Please contact support.")
      setIsUploading(false)
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", uploadPreset)

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(
          `Cloudinary upload failed: ${response.status} ${response.statusText}`
        )
      }

      const data = await response.json()
      console.log("Cloudinary Upload Success:", data)

      if (data.secure_url) {
        // Success - call the parent component with the image URL
        if (typeof onImageUpload === "function") {
          console.log("Setting banner image URL:", data.secure_url)
          onImageUpload(data.secure_url)
        } else {
          console.warn("onImageUpload prop is not a function or not provided")
        }
      } else {
        throw new Error("No secure URL returned from Cloudinary")
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error)
      setError(
        "Failed to upload image. Please check your connection and try again."
      )
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div
      ref={ref}
      className="relative w-full h-[50vh] overflow-hidden bg-black"
    >
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/api/placeholder/1920/1080"
          alt="background"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      {/* Glassmorphic container */}
      <div className="relative flex items-center justify-center w-full h-full px-4">
        <div className="w-full max-w-3xl p-6 md:p-8 rounded-xl bg-black bg-opacity-60 backdrop-blur-lg border border-gray-800 shadow-xl">
          <div className="text-center">
            <h1 className="mb-2 text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-white">
              Create Your Event
            </h1>
            <p className="mb-4 text-base md:text-lg font-light text-gray-300">
              Upload a banner image for your event below.
            </p>

            {/* Image upload area */}
            <div className="mb-4 p-3 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />

                {previewImage ? (
                  <div className="relative w-full">
                    <img
                      src={previewImage}
                      alt="Event banner preview"
                      className="max-h-48 mx-auto rounded-md object-contain"
                    />
                    <p className="mt-2 text-sm text-gray-400">
                      {isUploading ? "Uploading..." : "Click to change image"}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-4">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <span className="text-gray-300 text-base mb-1">
                      Upload Event Banner
                    </span>
                    <span className="text-gray-500 text-xs">
                      Click to select an image
                    </span>
                  </div>
                )}
              </label>
            </div>
            {error && (
              <div className="mt-2 p-2 bg-red-900 bg-opacity-50 border border-red-700 rounded-md text-red-200">
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
