import React from "react"
import { useLocation, Routes, Route } from "react-router-dom"
import Navbar from "./components/layout/Navbar"
import SignIn from "./components/sign-in/SignIn"
import SignUp from "./components/sing-up/SignUp"
import ForgotPassword from "./components/forgot-password/ForgotPassword"
import HomePage from "./pages/HomePage"
import ContactPage from "./pages/ContactPage"
import AllEventsPage from "./pages/AllEventsPage"
import EventDetailsPage from "./pages/EventDetailsPage"
import OrganizerDashboardPage from "./pages/OrganizerDashboardPage"
import Footer from "./components/layout/Footer"
import CreateEventPage from "./pages/CreateEventPage"
import FaqPage from "./pages/FaqPage"
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"
import TermsConditionsPage from "./pages/TermsConditionsPage"
import ProtectedRoute from "./components/ProtectedRoute"

// Wrapper component to conditionally render Navbar and Footer
const AppLayout = () => {
  const location = useLocation()

  // Check if current route is an auth page
  const isAuthPage = ["/signin", "/signup", "/forgot-password"].includes(
    location.pathname
  )

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/signin"
          element={<SignIn />}
        />
        <Route
          path="/signup"
          element={<SignUp />}
        />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/contact"
          element={<ContactPage />}
        />
        <Route
          path="/events"
          element={<AllEventsPage />}
        />
        <Route
          path="/events/create"
          element={
            <ProtectedRoute>
              <CreateEventPage />
            </ProtectedRoute>
          }
        />
        {/* Add the edit event route - protected */}
        <Route
          path="/events/edit/:id"
          element={
            <ProtectedRoute>
              <OrganizerDashboardPage />
            </ProtectedRoute>
          }
        />
        {/* Add the organizer dashboard route - protected */}
        <Route
          path="/organizer/events"
          element={
            <ProtectedRoute>
              <OrganizerDashboardPage />
            </ProtectedRoute>
          }
        />
        {/* Add the dynamic route for event details */}
        <Route
          path="/event/:id"
          element={<EventDetailsPage />}
        />
        <Route
          path="/faq"
          element={<FaqPage />}
        />
        <Route
          path="/terms"
          element={<TermsConditionsPage />}
        />
        <Route
          path="/privacy"
          element={<PrivacyPolicyPage />}
        />
      </Routes>
      {!isAuthPage && <Footer />}
    </>
  )
}

export default function App() {
  return <AppLayout />
}
