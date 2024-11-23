const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: {
      type: String, // Should be 'Point'
      enum: ["Point"],
      required: true,
    },
    name: {
      type: String,
    },
    street: { type: String},
    district: {type : String},
    province: { type: String},
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  images: [{ type: String }], // Array of URLs for event images
  notesForAttendees: { type: String, default: "" }, // Notes for attendees
  tags: [{ type: String }], // Tags for the event (e.g., "Music", "Workshop")
  category: {
    type: String,
  },
  date: { type: Date, required: true },
  time: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

// Ensure the schema supports geolocation
eventSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Event", eventSchema);
