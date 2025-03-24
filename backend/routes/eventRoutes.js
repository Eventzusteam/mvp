import express from "express"
import Event from "../models/Event.js"
import validator from "validator"
import fs from "fs"
import { uploadToCloudinary, upload } from "../utils/cloudinary.js"
import authMiddleware, { roleMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router()

// 📌 Create New Event (Users Only)
router.post(
  "/create",
  authMiddleware,
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
      } catch (parseError) {
        return res.status(400).json({
          error: "Invalid JSON format in ticketTypes, speakers, or socialMedia",
        })
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
        organiserName,
        organiserEmail,
        organiserPhone,
        bannerImage, // Add this line to include the banner image in the event data
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
    if (!validator.isMongoId(req.params.id)) {
      return res.status(400).json({ error: "Invalid event ID format" })
    }

    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email")
      .lean()
    if (!event) return res.status(404).json({ error: "Event not found" })

    // event.organizerId = event.createdBy._id

    // res.json(event)

    res.json(event)
  } catch (error) {
    console.error("Fetch event error:", error)
    res.status(500).json({ error: "Error fetching event" })
  }
})

// 📌 Update Event (Only by Creator)
router.put(
  "/:id",
  authMiddleware,
  upload.array("images", 5),
  async (req, res) => {
    try {
      if (!validator.isMongoId(req.params.id)) {
        return res.status(400).json({ error: "Invalid event ID format" })
      }

      const event = await Event.findById(req.params.id)
      if (!event) return res.status(404).json({ error: "Event not found" })

      // Authorization check
      if (event.createdBy.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ error: "Unauthorized to update this event" })
      }

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
        removeImages,
        bannerImage,
      } = req.body

      // Handle image uploads
      if (req.files && req.files.length > 0) {
        try {
          const newImages = await Promise.all(
            req.files.map((file) => uploadToCloudinary(file.path))
          )
          event.images = [...event.images, ...newImages] // Append new images
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

      // Handle image removals if specified
      if (removeImages) {
        try {
          const imagesToRemove = JSON.parse(removeImages)
          if (Array.isArray(imagesToRemove)) {
            event.images = event.images.filter(
              (img) => !imagesToRemove.includes(img)
            )
          }
        } catch (parseError) {
          return res.status(400).json({ error: "Invalid removeImages format" })
        }
      }

      // Date validation
      if (startDate && !validator.isDate(new Date(startDate))) {
        return res.status(400).json({ error: "Invalid start date format" })
      }

      if (endDate && !validator.isDate(new Date(endDate))) {
        return res.status(400).json({ error: "Invalid end date format" })
      }

      // Email validation
      if (organiserEmail && !validator.isEmail(organiserEmail)) {
        return res.status(400).json({ error: "Invalid organiser email" })
      }

      // Update fields only if they are provided (allows partial updates)
      const updateFields = {
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
        maxAttendees:
          maxAttendees !== undefined ? Number(maxAttendees) : undefined,
        organiserName,
        organiserEmail,
        organiserPhone,
        bannerImage,
      }

      // Remove undefined fields (don't update fields that weren't sent)
      Object.keys(updateFields).forEach((key) => {
        if (updateFields[key] === undefined) {
          delete updateFields[key]
        } else {
          event[key] = updateFields[key]
        }
      })

      // Parse and update arrays and objects safely
      try {
        if (ticketTypes) {
          event.ticketTypes = JSON.parse(ticketTypes)
        }

        if (socialMedia) {
          event.socialMedia = JSON.parse(socialMedia)
        }

        if (speakers) {
          event.speakers = JSON.parse(speakers)
        }
      } catch (parseError) {
        return res.status(400).json({
          error: "Invalid JSON format in ticketTypes, speakers, or socialMedia",
        })
      }

      await event.save()
      res.status(200).json(event)
    } catch (error) {
      console.error("Event update error:", error)
      // Check if this is a mongoose validation error
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

// 📌 Delete Single Event (Only by Creator)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) {
      return res.status(400).json({ error: "Invalid event ID format" })
    }

    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ error: "Event not found" })

    if (event.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this event" })
    }

    await Event.deleteOne({ _id: event._id })
    res.json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("Event deletion error:", error)
    res.status(500).json({ error: "Error deleting event" })
  }
})

// 📌 Admin: Get All Events (with Pagination)
router.get(
  "/admin/all",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      let {
        page = 1,
        limit = 10,
        sort = "startDate",
        order = "asc",
      } = req.query
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
      console.error("Admin fetch events error:", error)
      res.status(500).json({ error: "Error fetching events" })
    }
  }
)

// 📌 Admin: Delete Any Event
router.delete(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      if (!validator.isMongoId(req.params.id)) {
        return res.status(400).json({ error: "Invalid event ID format" })
      }

      const event = await Event.findById(req.params.id)
      if (!event) return res.status(404).json({ error: "Event not found" })

      await Event.deleteOne({ _id: event._id })
      res.json({ message: "Event deleted successfully by admin" })
    } catch (error) {
      console.error("Admin delete event error:", error)
      res.status(500).json({ error: "Error deleting event" })
    }
  }
)

// 📌 Admin: Bulk Delete Events
router.delete(
  "/admin/bulk-delete",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const { eventIds } = req.body // Expecting an array of event IDs

      if (!eventIds || !Array.isArray(eventIds)) {
        return res
          .status(400)
          .json({ error: "Invalid request. Provide an array of event IDs." })
      }

      // Validate all IDs before deletion
      for (const id of eventIds) {
        if (!validator.isMongoId(id)) {
          return res.status(400).json({
            error: `Invalid event ID format: ${id}`,
          })
        }
      }

      const result = await Event.deleteMany({ _id: { $in: eventIds } })
      res.json({
        message: "Bulk deletion successful",
        deletedCount: result.deletedCount,
      })
    } catch (error) {
      console.error("Bulk delete error:", error)
      res.status(500).json({ error: "Error deleting events" })
    }
  }
)

export default router
