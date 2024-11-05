// models/attendanceModel.js
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  attendanceRecords: [
    {
      date: {
        type: Date,
        required: true,
      },
      startTime: {
        type: Date,
        required: true,
      },
      endTime: {
        type: Date,
      },
      actualStartTime: {
        type: Date,
      },
      lateHours: {
        type: Number, // in hours
        default: 0,
      },
      workedHours: {
        type: Number, // in hours
        default: 0,
      },
      status: {
        type: String,
        enum: ["Present", "Absent", "Late"],
        default: "Absent",
      },
    },
  ],
  daysWorked: {
    type: Number,
    default: 0,
  },
  daysAbsent: {
    type: Number,
    default: 0,
  },
  totalWorkingHours: {
    type: Number,
    default: 0, // total hours worked by the employee
  },
  totalLateHours: {
    type: Number,
    default: 0, // total hours late
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Reset the counters at the end of each month
attendanceSchema.methods.resetMonthlyCounters = function () {
  this.daysWorked = 0;
  this.daysAbsent = 0;
  this.totalWorkingHours = 0;
  this.totalLateHours = 0;
};

module.exports = mongoose.model("Attendance", attendanceSchema);
