import React from "react"
import Header from "./Header"
import FaqSection from "./FaqSection"

const Faq = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Header />
        <FaqSection />
      </div>
    </div>
  )
}

export default Faq
