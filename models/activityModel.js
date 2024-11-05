// models/Activity.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new Schema({
  action: {
    type: String,
    enum: ["Created", "Updated", "Deleted"], // Type of action
    required: true,
  },
  model: {
    type: String,
    enum: ["Task", "Project", "Employee", "Department"], // Which model was updated
    required: true,
  },
  entityId: { type: Schema.Types.ObjectId, required: true }, // ID of the entity i.e taskId
  description: { type: String }, // Description of what was updated
  performedBy: { type: Schema.Types.ObjectId, ref: "Employee" }, // Employee who made the change
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

module.exports = mongoose.model("Activity", activitySchema);
