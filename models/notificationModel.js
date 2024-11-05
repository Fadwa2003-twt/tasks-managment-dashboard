// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  createdAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
});

module.exports = mongoose.model("Notification", notificationSchema);
