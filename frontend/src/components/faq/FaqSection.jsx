// FaqSection.jsx
import React, { useState } from "react"
import FaqCategory from "./FaqCategory"
import faqCategories from "./data/Faq"

const FaqSection = () => {
  const [activeCategory, setActiveCategory] = useState(null)

  // List of all available FAQ categories
  const categories = Object.keys(faqCategories)

  return (
    <div className="space-y-8">
      {categories.map((category, index) => (
        <FaqCategory
          key={category}
          category={category}
          categoryData={faqCategories[category]}
          isActive={activeCategory === category}
          setActiveCategory={setActiveCategory}
          index={index}
        />
      ))}
    </div>
  )
}

export default FaqSection
