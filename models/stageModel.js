const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stageSchema = new Schema({
  title: { type: String, required: true }, // Title of the stage
  description: { type: String }, // Description of the stage
  startDate: { type: Date, required: true }, // Stage start date
  endDate: { type: Date, required: true }, // Stage end date
  status: {
    type: String,
    enum: ["Planning", "Execution", "Review", "Completed"],
    default: "Planning",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save hook to update the `updatedAt` field
stageSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Stage", stageSchema);
