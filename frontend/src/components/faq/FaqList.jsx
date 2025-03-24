// FaqList.jsx
import React, { useState } from "react"
import FaqItem from "./FaqItem"

const FaqList = ({ faqs }) => {
  const [activeQuestion, setActiveQuestion] = useState(null)

  const toggleQuestion = (id) => {
    setActiveQuestion(activeQuestion === id ? null : id)
  }

  return (
    <div className="space-y-4 mt-4">
      {faqs.map((faq) => (
        <FaqItem
          key={faq.id}
          faq={faq}
          isActive={activeQuestion === faq.id}
          toggle={() => toggleQuestion(faq.id)}
        />
      ))}
    </div>
  )
}

export default FaqList
