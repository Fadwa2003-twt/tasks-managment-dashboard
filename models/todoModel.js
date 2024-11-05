const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    startDate: {
      // New field for start date
      type: Date,
      required: true, // Make this required if you want to enforce it
    },
    dueDate: {
      type: Date,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", TodoSchema);
