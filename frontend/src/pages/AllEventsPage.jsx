import React from "react"
import Hero from "../components/events/showAll/Hero"
import AllEvents from "../components/events/showAll/allEvents/AllEvents"
import FilterSearch from "../components/events/showAll/filterSearch/FilterSearch"

export default function AllEventsPage() {
  return (
    <>
      <Hero />
      <FilterSearch />
      <AllEvents />
    </>
  )
}
