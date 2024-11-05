const mongoose = require("mongoose");

const rotationRequestSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: { type: Date, required: true }, // The specific date they want to change
  currentStartTime: { type: String, required: true }, // Current rotation time
  currentEndTime: { type: String, required: true },
  requestedStartTime: { type: String }, // Requested new time (optional for deletions)
  requestedEndTime: { type: String },
  requestType: { type: String, enum: ["edit", "delete"], required: true }, // "edit" or "delete"
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  comments: { type: String }, // Optional comments (e.g., rejection reason)
});

module.exports = mongoose.model("RotationRequest", rotationRequestSchema);
