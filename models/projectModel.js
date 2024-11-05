const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
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
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  tasks: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

projectSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Project", projectSchema);
