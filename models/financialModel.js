const mongoose = require("mongoose");

const financialSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    validate: {
      validator: async function (value) {
        const employee = await mongoose.model("Employee").findById(value);
        return !!employee;
      },
      message: "Invalid employee ID",
    },
    required: true,
  },
  salary: { type: Number, required: true }, // Monthly salary
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
    validate: {
      validator: async function (value) {
        const department = await mongoose.model("Department").findById(value);
        return !!department;
      },
      message: "Invalid Department ID",
    },
  },
  role: {
    type: mongoose.Schema.Types.ObjectId, // Referencing the Role model
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
  bonuses: { type: Number, default: 0 }, // Additional bonuses
  deductions: { type: Number, default: 0 }, // Deductions like fines or unpaid leaves
  totalPayment: { type: Number, required: true }, // Calculated total after bonuses and deductions
  salaryAdvanceRequests: [
    {
      requestAmount: { type: Number, required: true },
      status: {
        type: String,
        enum: ["In Process", "Accepted", "Denied"],
        default: "In Process",
      },
      requestDate: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Financial", financialSchema);
