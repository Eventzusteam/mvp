import express from "express"
import Event from "../models/Event.js"
import validator from "validator"
import fs from "fs"
import { uploadToCloudinary, upload } from "../utils/cloudinary.js"
import authMiddleware, { roleMiddleware } from "../middleware/authMiddleware.js"
import { validateCsrfToken } from "../middleware/csrfMiddleware.js"

const router = express.Router()

// 📌 Create New Event (Users Only)
router.post(
  "/create",
  authMiddleware,
  validateCsrfToken, // <-- Add CSRF validation
  upload.array("images", 5), // Limit to 5 images
  async (req, res) => {
    try {
      const {
        title,
        description,
        category,
        startDate,
        endDate,
        startTime,
        endTime,
        timezone,
        locationType,
        venue,
        address,
        city,
        state,
        zipCode,
        country,
        onlineLink,
        maxAttendees,
        ticketTypes,
        socialMedia,
        speakers,
        organiserName,
        organiserEmail,
        organiserPhone,
        bannerImage,
      } = req.body

      // Input Validation
      if (!title || !description || !startDate || !locationType) {
        return res.status(400).json({ error: "Missing required fields" })
      }

      // Date validation
      if (!validator.isDate(new Date(startDate))) {
        return res.status(400).json({ error: "Invalid start date format" })
      }

      if (endDate && !validator.isDate(new Date(endDate))) {
        return res.status(400).json({ error: "Invalid end date format" })
      }

      // Location validation
      if (locationType === "physical" && (!venue || !city)) {
        return res.status(400).json({
          error: "Physical events require venue and city information",
        })
      }

      if (locationType === "online" && !onlineLink) {
        return res.status(400).json({
          error: "Online events require a meeting link",
        })
      }

      // Email validation
      if (organiserEmail && !validator.isEmail(organiserEmail)) {
        return res.status(400).json({ error: "Invalid organiser email" })
      }

      // Image Upload Processing
      let images = []
      if (req.files && req.files.length > 0) {
        try {
          images = await Promise.all(
            req.files.map((file) => uploadToCloudinary(file.path))
          )
        } catch (uploadError) {
          console.error("Image upload error:", uploadError)
          return res.status(400).json({ error: "Failed to upload images" })
        } finally {
          // Clean up local files regardless of upload success
          req.files.forEach((file) => {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path)
            }
          })
        }
      }

      // Parse Arrays safely
      let parsedTicketTypes = []
      let parsedSpeakers = []
      let parsedSocialMedia = {}
      let parsedTags = []
      let parsedAgenda = []
      let parsedSponsors = []
      let parsedFaqs = []

      try {
        // For ticketTypes array
        if (req.body.ticketTypes) {
          parsedTicketTypes =
            typeof req.body.ticketTypes === "string"
              ? JSON.parse(req.body.ticketTypes)
              : req.body.ticketTypes
        }

        // For socialMedia object
        if (req.body.socialMedia) {
          parsedSocialMedia =
            typeof req.body.socialMedia === "string"
              ? JSON.parse(req.body.socialMedia)
              : req.body.socialMedia
        }

        // For speakers array
        if (req.body.speakers) {
          parsedSpeakers =
            typeof req.body.speakers === "string"
              ? JSON.parse(req.body.speakers)
              : req.body.speakers
        }

        // For tags array
        if (req.body.tags) {
          parsedTags =
            typeof req.body.tags === "string"
              ? JSON.parse(req.body.tags)
              : req.body.tags
        }

        // For agenda array
        if (req.body.agenda) {
          parsedAgenda =
            typeof req.body.agenda === "string"
              ? JSON.parse(req.body.agenda)
              : req.body.agenda
        }

        // For sponsors array
        if (req.body.sponsors) {
          parsedSponsors =
            typeof req.body.sponsors === "string"
              ? JSON.parse(req.body.sponsors)
              : req.body.sponsors
        }

        // For faqs array
        if (req.body.faqs) {
          parsedFaqs =
            typeof req.body.faqs === "string"
              ? JSON.parse(req.body.faqs)
              : req.body.faqs
        }
      } catch (parseError) {
        return res.status(400).json({
          error: "Invalid JSON format in one of the provided fields",
        })
      }

      // Process banner image if it's a URL or base64 string
      let processedBannerImage = bannerImage
      if (
        bannerImage &&
        typeof bannerImage === "string" &&
        bannerImage.startsWith("data:")
      ) {
        try {
          // If it's a base64 string, upload it to Cloudinary
          const uploadResult = await uploadToCloudinary(bannerImage)
          processedBannerImage = uploadResult
          // console.log("Processed banner image:", processedBannerImage) // Commented out log
        } catch (uploadError) {
          console.error("Banner image upload error:", uploadError)
          return res
            .status(400)
            .json({ error: "Failed to upload banner image" })
        }
      }

      // Create Event
      const eventData = {
        title,
        description,
        category,
        startDate,
        endDate,
        startTime,
        endTime,
        timezone,
        locationType,
        venue,
        address,
        city,
        state,
        zipCode,
        country,
        onlineLink,
        maxAttendees: maxAttendees ? Number(maxAttendees) : undefined,
        ticketTypes: parsedTicketTypes,
        socialMedia: parsedSocialMedia,
        speakers: parsedSpeakers,
        tags: parsedTags,
        agenda: parsedAgenda,
        sponsors: parsedSponsors,
        faqs: parsedFaqs,
        organiserName,
        organiserEmail,
        organiserPhone,
        bannerImage: processedBannerImage, // Use the processed banner image
        images,
        createdBy: req.user.id,
      }

      const event = await Event.create(eventData)

      res.status(201).json(event)
    } catch (error) {
      console.error("Event creation error:", error)
      // Check if this is a mongoose validation error
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map(
          (err) => err.message
        )
        return res.status(400).json({ error: validationErrors })
      }
      res.status(500).json({ error: "Server error. Please try again later." })
    }
  }
)

// 📌 Get Events Created by the Logged-In User (with Pagination)
router.get("/", authMiddleware, async (req, res) => {
  try {
    let { page = 1, limit = 10, sort = "startDate", order = "asc" } = req.query
    page = parseInt(page)
    limit = parseInt(limit)

    // Validate and sanitize sort parameter
    const allowedSortFields = ["startDate", "title", "createdAt", "updatedAt"]
    if (!allowedSortFields.includes(sort)) {
      sort = "startDate"
    }

    // Create sort object
    const sortObj = {}
    sortObj[sort] = order === "desc" ? -1 : 1

    const totalEvents = await Event.countDocuments({ createdBy: req.user.id })
    const events = await Event.find({ createdBy: req.user.id })
      .populate("createdBy", "name email")
      .sort(sortObj)
      .limit(limit)
      .skip((page - 1) * limit)

    res.json({
      events,
      totalPages: Math.ceil(totalEvents / limit),
      currentPage: page,
      totalEvents,
    })
  } catch (error) {
    console.error("Fetch events error:", error)
    res.status(500).json({ error: "Error fetching events" })
  }
})

// 📌 Get All Public Events (with Pagination)
router.get("/get-public-events", async (req, res) => {
  try {
    let { page = 1, limit = 10, sort = "startDate", order = "asc" } = req.query
    page = parseInt(page)
    limit = parseInt(limit)

    // Validate and sanitize sort parameter
    const allowedSortFields = ["startDate", "title", "createdAt", "updatedAt"]
    if (!allowedSortFields.includes(sort)) {
      sort = "startDate"
    }

    // Create sort object
    const sortObj = {}
    sortObj[sort] = order === "desc" ? -1 : 1

    const totalEvents = await Event.countDocuments()
    const events = await Event.find()
      .populate("createdBy", "name email")
      .sort(sortObj)
      .limit(limit)
      .skip((page - 1) * limit)

    res.json({
      events,
      totalPages: Math.ceil(totalEvents / limit),
      currentPage: page,
      totalEvents,
    })
  } catch (error) {
    console.error("Fetch public events error:", error)
    res.status(500).json({ error: "Error fetching events" })
  }
})

// 📌 Get Single Event by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const eventId = req.params.id
    if (!validator.isMongoId(eventId)) {
      return res.status(400).json({ error: "Invalid event ID format" })
    }

    const event = await Event.findById(eventId)
      .populate("createdBy", "name email")
      .lean()
    if (!event) return res.status(404).json({ error: "Event not found" })

    // Add organizerId for frontend check
    event.organizerId = event.createdBy._id

    res.json(event)
  } catch (error) {
    console.error("Fetch event error:", error)
    res.status(500).json({ error: "Error fetching event" })
  }
})

// 📌 Get Single Event by ID (Public - No Auth Required)
// This route allows anyone to view event details.
router.get("/public/:id", async (req, res) => {
  try {
    const eventId = req.params.id
    if (!validator.isMongoId(eventId)) {
      return res.status(400).json({ error: "Invalid event ID format" })
    }

    const event = await Event.findById(eventId)
      .populate("createdBy", "name email") // Populate organizer info
      .lean() // Use lean for performance if not modifying the doc

    if (!event) {
      return res.status(404).json({ error: "Event not found" })
    }

    // Optionally add organizerId if needed by public view
    event.organizerId = event.createdBy?._id

    res.json(event)
  } catch (error) {
    console.error("Fetch public event error:", error)
    res.status(500).json({ error: "Error fetching event details" })
  }
})

// 📌 PATCH Event Section (Only by Creator)
router.patch(
  "/:id/:section",
  authMiddleware,
  validateCsrfToken, // <-- Add CSRF validation
  upload.none(), // Use upload.none() if not handling file uploads here, or adjust as needed
  async (req, res) => {
    const { id, section } = req.params
    const updateData = req.body

    try {
      if (!validator.isMongoId(id)) {
        return res.status(400).json({ error: "Invalid event ID format" })
      }

      const event = await Event.findById(id)
      if (!event) return res.status(404).json({ error: "Event not found" })

      // Authorization check
      if (event.createdBy.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ error: "Unauthorized to update this event" })
      }

      // Validate section
      const allowedSections = [
        "details", // Basic info: title, dates, location, category, description, tags, maxAttendees
        "organizer", // Organiser info: name, email, phone, socialMedia
        "speakers", // Array
        "agenda", // Array
        "sponsors", // Array
        "faqs", // Array
        "bannerImage", // String (URL or base64 for upload)
        "ticketTypes", // Array
      ]
      if (!allowedSections.includes(section)) {
        return res.status(400).json({ error: "Invalid update section" })
      }

      // Update the specific section
      switch (section) {
        case "details":
          const allowedDetailFields = [
            "title",
            "description",
            "category",
            "startDate",
            "endDate",
            "startTime",
            "endTime",
            "timezone",
            "locationType",
            "venue",
            "address",
            "city",
            "state",
            "zipCode",
            "country",
            "onlineLink",
            "maxAttendees",
            "tags",
          ]
          for (const key of allowedDetailFields) {
            if (updateData.hasOwnProperty(key)) {
              // Specific validation
              if (
                (key === "startDate" || key === "endDate") &&
                updateData[key] &&
                !validator.isDate(new Date(updateData[key]))
              ) {
                return res.status(400).json({ error: `Invalid ${key} format` })
              }
              // Handle specific types
              if (key === "maxAttendees" && updateData[key] !== undefined) {
                event[key] = Number(updateData[key])
              } else if (key === "tags") {
                if (Array.isArray(updateData.tags)) {
                  event.tags = updateData.tags
                } else if (updateData.tags === null) {
                  event.tags = [] // Allow clearing tags
                } else {
                  return res
                    .status(400)
                    .json({ error: "Tags must be an array." })
                }
              } else {
                event[key] = updateData[key]
              }
            }
          }
          break
        case "organizer":
          const allowedOrganizerFields = [
            "organiserName",
            "organiserEmail",
            "organiserPhone",
            "socialMedia",
          ]
          for (const key of allowedOrganizerFields) {
            if (updateData.hasOwnProperty(key)) {
              if (
                key === "organiserEmail" &&
                updateData[key] &&
                !validator.isEmail(updateData[key])
              ) {
                return res
                  .status(400)
                  .json({ error: "Invalid organiser email" })
              }
              // If socialMedia is an object, handle potential partial updates carefully
              if (
                key === "socialMedia" &&
                typeof updateData.socialMedia === "object"
              ) {
                event.socialMedia = {
                  ...event.socialMedia,
                  ...updateData.socialMedia,
                }
              } else {
                event[key] = updateData[key]
              }
            }
          }
          break
        case "speakers":
        case "agenda":
        case "sponsors":
        case "faqs":
        case "ticketTypes":
          // These typically replace the entire array
          if (
            updateData.hasOwnProperty(section) &&
            Array.isArray(updateData[section])
          ) {
            event[section] = updateData[section]
          } else {
            // Allow sending an empty array to clear the section
            if (
              updateData.hasOwnProperty(section) &&
              updateData[section] === null
            ) {
              event[section] = []
            } else {
              return res.status(400).json({
                error: `Invalid data format for ${section}. Expected an array.`,
              })
            }
          }
          break
        case "bannerImage":
          if (updateData.hasOwnProperty("bannerImage")) {
            let processedBannerImage = updateData.bannerImage
            if (
              processedBannerImage &&
              typeof processedBannerImage === "string" &&
              processedBannerImage.startsWith("data:")
            ) {
              try {
                const uploadResult = await uploadToCloudinary(
                  processedBannerImage
                )
                processedBannerImage = uploadResult
              } catch (uploadError) {
                console.error("Banner image upload error:", uploadError)
                return res
                  .status(400)
                  .json({ error: "Failed to upload banner image" })
              }
            }
            event.bannerImage = processedBannerImage
          }
          break
        default:
          return res.status(400).json({ error: "Invalid update section" })
      }

      // Save the updated event
      const updatedEvent = await event.save()
      res.json(updatedEvent)
    } catch (error) {
      console.error("Update event error:", error)
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map(
          (err) => err.message
        )
        return res.status(400).json({ error: validationErrors })
      }
      res.status(500).json({ error: "Error updating event" })
    }
  }
)

// 📌 Delete Event (Only by Creator)
router.delete(
  "/delete/:id",
  authMiddleware,
  validateCsrfToken,
  async (req, res) => {
    // <-- Add CSRF validation
    try {
      const eventId = req.params.id
      if (!validator.isMongoId(eventId)) {
        return res.status(400).json({ error: "Invalid event ID format" })
      }

      const event = await Event.findById(eventId)
      if (!event) return res.status(404).json({ error: "Event not found" })

      // Authorization check
      if (event.createdBy.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ error: "Unauthorized to delete this event" })
      }

      await Event.findByIdAndDelete(eventId)

      res.json({ message: "Event deleted successfully" })
    } catch (error) {
      console.error("Delete event error:", error)
      res.status(500).json({ error: "Error deleting event" })
    }
  }
)

// 📌 Get Single Event by ID - REMOVED DUPLICATE

export default router
