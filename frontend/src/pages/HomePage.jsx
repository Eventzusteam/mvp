import React from "react"
import Hero from "../components/home/Hero"
import FeaturedEvents from "../components/home/FeaturedEvents"
import FeaturedVendors from "../components/home/FeaturedVendors"
import ContactCta from "../components/home/ContactCta"

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedEvents />
      <FeaturedVendors />
      <ContactCta />
    </>
  )
}
