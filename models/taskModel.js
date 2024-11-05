const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Activity = require("./activityModel");

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: Schema.Types.ObjectId, ref: "Employee" }, // Assign task to an employee
  deadline: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Not Started",
  },
  priority: {
    type: String,
    enum: ["Urgent and Important", "Urgent", "Not Urgent", "Not Important"],
    required: true,
  },
  project: { type: Schema.Types.ObjectId, ref: "Project" },
  stages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stage" }], // Array of stage references
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);
