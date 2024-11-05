// controllers/authController.js

const jwt = require("jsonwebtoken");
const Employee = require("../models/employeeModel");

// Helper to create JWT token
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Login user (email & password)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log({ email, password });

    // Check if employee exists
    const employee = await Employee.findOne({ email }).select("+password");
    if (!employee) {
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid credentials" });
    }

    // Check if the password matches
    const isMatch = await employee.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid credentials" });
    }

    // Generate token
    const token = createToken(employee._id);

    res.status(200).json({
      status: "success",
      token,
      data: { employee },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
