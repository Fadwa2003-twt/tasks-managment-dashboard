// Middleware to protect routes
const jwt = require("jsonwebtoken");
const Employee = require("../models/employeeModel");
const Role = require("../models/roleModel");

exports.protect = async (req, res, next) => {
  try {
    // Check if token exists
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find employee from token
    const employee = await Employee.findById(decoded.id);
    if (!employee) {
      return res
        .status(401)
        .json({ status: "fail", message: "Token is invalid" });
    }

    // Add employee to request
    req.user = employee;
    next();
  } catch (err) {
    res.status(401).json({ status: "fail", message: err.message });
  }
};
