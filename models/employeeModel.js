const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Employee must have a password"],
    select: false,
  },
  financial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Financial",
  },
  rotation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rotation",
  },

  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    validate: {
      validator: async function (value) {
        const department = await mongoose.model("Department").findById(value);
        return !!department;
      },
      message: "Invalid department ID",
    },
    required: function () {
      return this.role !== "Guest";
    },
  },
  phone: {
    type: String,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
    validate: {
      validator: async function (value) {
        const role = await mongoose.model("Role").findById(value);
        return !!role;
      },
      message: "Invalid role ID",
    },
  },
  profilePicture: {
    type: String,
    default: "/uploads/profilePictures/placeholder.png",
  },
  age: {
    type: Number,
    default: 22,
    required: function () {
      return this.role !== "Guest";
    },
  },
  levelOfEducation: {
    type: String,
    enum: ["High School", "Diploma", "Bachelor's", "Master's", "PhD"],
    default: "Bachelor's",
  },
  workingHours: {
    type: Number,
    default: 40,
  },
  workingDays: [
    {
      day: {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        required: true,
      },
      fromToHours: {
        from: {
          type: String, // e.g. "09:00"
          required: true,
        },
        to: {
          type: String, // e.g. "17:00"
          required: true,
        },
      },
    },
  ],
  holidays: {
    type: Number,
    default: 2,
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

employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

employeeSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

employeeSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Employee", employeeSchema);
