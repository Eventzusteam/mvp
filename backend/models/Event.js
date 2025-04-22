import mongoose from "mongoose"
import validator from "validator"

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
    },
    startTime: {
      type: String,
      trim: true,
    },
    endTime: {
      type: String,
      trim: true,
    },
    timezone: {
      type: String,
      default: "UTC",
      trim: true,
    },
    locationType: {
      type: String,
      required: [true, "Location type is required"],
      enum: ["physical", "online", "hybrid"],
      trim: true,
    },
    venue: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    zipCode: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    onlineLink: {
      type: String,
      trim: true,
    },
    maxAttendees: {
      type: Number,
      min: 0,
    },
    ticketTypes: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        quantity: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
    },
    speakers: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        company: String,
        bio: String,
        photo: String,
      },
    ],
    tags: [String],
    agenda: [
      {
        time: String,
        title: String,
        description: String,
        speaker: String,
      },
    ],
    sponsors: [
      {
        name: String,
        logo: String,
        website: String,
        level: String,
      },
    ],
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],
    organiserName: {
      type: String,
      trim: true,
    },
    organiserEmail: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return validator.isEmail(v)
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    organiserPhone: {
      type: String,
      trim: true,
    },
    // Add dedicated banner image field
    bannerImage: {
      type: String,
      trim: true,
    },
    images: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
)

const Event = mongoose.model("Event", eventSchema)
export default Event
