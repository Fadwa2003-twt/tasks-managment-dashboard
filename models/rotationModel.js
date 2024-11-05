const mongoose = require("mongoose");

const rotationSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  schedule: [
    {
      day: { type: String, required: true },
      date: { type: Date, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
  ],
  month: { type: String, required: true }, // e.g., "November 2024"
});

module.exports = mongoose.model("Rotation", rotationSchema);
