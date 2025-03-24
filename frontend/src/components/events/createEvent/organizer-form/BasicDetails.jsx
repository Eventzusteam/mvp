import React, { useState } from "react"
import { motion } from "framer-motion"
import { Upload, X, Plus } from "lucide-react"

const BasicDetails = ({ formData, updateFormData }) => {
  const [dragActive, setDragActive] = useState(false)
  const [previewImage, setPreviewImage] = useState(formData.featuredImage)
  const [galleryPreviews, setGalleryPreviews] = useState(formData.galleryImages)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (file) => {
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewImage(reader.result)
      updateFormData("basic", { featuredImage: reader.result })
    }
    reader.readAsDataURL(file)
  }

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const newPreviews = [...galleryPreviews]

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        newPreviews.push(reader.result)
        setGalleryPreviews([...newPreviews])
        updateFormData("basic", { galleryImages: [...newPreviews] })
      }
      reader.readAsDataURL(file)
    })
  }

  const removeGalleryImage = (index) => {
    const newPreviews = [...galleryPreviews]
    newPreviews.splice(index, 1)
    setGalleryPreviews(newPreviews)
    updateFormData("basic", { galleryImages: newPreviews })
  }

  const categories = [
    "Conference",
    "Workshop",
    "Seminar",
    "Networking",
    "Webinar",
    "Concert",
    "Exhibition",
    "Sports",
    "Festival",
    "Other",
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Event Details
        </h3>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Event Title*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={(e) =>
                updateFormData("basic", { title: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type*
            </label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  id="public"
                  name="eventType"
                  type="radio"
                  checked={formData.eventType === "public"}
                  onChange={() =>
                    updateFormData("basic", { eventType: "public" })
                  }
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <label
                  htmlFor="public"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Public
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="private"
                  name="eventType"
                  type="radio"
                  checked={formData.eventType === "private"}
                  onChange={() =>
                    updateFormData("basic", { eventType: "private" })
                  }
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <label
                  htmlFor="private"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Private
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Cost*
            </label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  id="free"
                  name="eventCost"
                  type="radio"
                  checked={formData.eventCost === "free"}
                  onChange={() =>
                    updateFormData("basic", { eventCost: "free" })
                  }
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <label
                  htmlFor="free"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Free
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="eventCost"
                  type="radio"
                  checked={formData.eventCost === "paid"}
                  onChange={() =>
                    updateFormData("basic", { eventCost: "paid" })
                  }
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Paid
                </label>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Event Category*
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={(e) =>
                updateFormData("basic", { category: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Event Description*
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={(e) =>
                updateFormData("basic", { description: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image*
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="featured-image"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files[0])}
              />

              {previewImage ? (
                <div className="relative w-full">
                  <img
                    src={previewImage}
                    alt="Featured event"
                    className="mx-auto h-40 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null)
                      updateFormData("basic", { featuredImage: null })
                    }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="featured-image"
                  className="cursor-pointer text-center"
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <span className="mt-2 block text-sm font-medium text-gray-700">
                    Drag and drop or click to upload
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </span>
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gallery Images (Optional)
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {galleryPreviews.map((img, index) => (
                <div
                  key={index}
                  className="relative h-24 border rounded overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`Gallery ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              <label
                htmlFor="gallery-images"
                className="cursor-pointer h-24 border-2 border-dashed rounded flex items-center justify-center hover:bg-gray-50"
              >
                <div className="text-center">
                  <Plus className="mx-auto h-6 w-6 text-gray-400" />
                  <span className="mt-1 block text-xs text-gray-500">
                    Add Image
                  </span>
                </div>
                <input
                  type="file"
                  id="gallery-images"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleGalleryUpload}
                />
              </label>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default BasicDetails
