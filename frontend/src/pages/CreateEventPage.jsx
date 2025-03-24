import React, { useState } from "react"
import Hero from "../components/events/createEvent/Hero"
import App from "../components/events/createEvent/organizer-form/App"

export default function CreateEventPage() {
  const [bannerImage, setBannerImage] = useState(null)

  const handleImageUpload = (imageUrl) => {
    setBannerImage(imageUrl)
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16 md:pt-20">
      {/* Hero section at the top */}
      <Hero onImageUpload={handleImageUpload} />

      <div className="container mx-auto px-4 py-12">
        <App initialBannerImage={bannerImage} />
      </div>
    </div>
  )
}
