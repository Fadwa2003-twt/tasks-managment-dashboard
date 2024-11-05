const Employee = require("../models/employeeModel");
const Financial = require("../models/financialModel");
const Rotation = require("../models/rotationModel");
const multer = require("multer");
const { generateRandomPassword } = require("../utils/passwordUtils");
const Role = require("../models/roleModel");
const nodemailer = require("nodemailer");
// Multer setup for profile picture uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profilePictures");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// GET all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("department")
      .populate("role")
      .populate("financial")
      .populate("rotation");
    res.status(200).json({ status: "success", data: employees });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("department")
      .populate("role")
      .populate("financial");
    if (!employee) {
      return res
        .status(404)
        .json({ status: "fail", message: "Employee not found" });
    }
    res.status(200).json({ status: "success", data: employee });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// Create new employee

exports.createEmployee = [
  upload.single("profilePicture"), // For handling file uploads
  async (req, res) => {
    try {
      // Extract required fields from request body
      const {
        name,
        email,
        phone,
        salary,
        workingHours,
        workingDays,
        holidays,
        role,
        department,
        password,
      } = req.body;

      // Check that no forbidden fields are included
      const forbiddenFields = ["age", "levelOfEducation"];
      forbiddenFields.forEach((field) => {
        if (req.body[field]) {
          throw new Error(`Cannot set ${field} field.`);
        }
      });

      const profilePicture = req.file ? req.file.path : null;

      // Create the new employee
      const employee = await Employee.create({
        name,
        email,
        phone,
        workingHours,
        workingDays,
        holidays,
        role,
        salary,
        password,
        department,
        profilePicture,
      });

      const financialRecord = await Financial.create({
        employee: employee._id,
        salary: req.body.salary || 0, // Set a default salary if not provided
        bonuses: req.body.bonuses || 0,
        deductions: req.body.deductions || 0,
        totalPayment: 0,
        role: employee.role,
        department: employee.department,
      });
      employee.financial = financialRecord._id;
      await employee.save();
      res.status(201).json({ status: "success", data: employee });
    } catch (err) {
      res.status(400).json({ status: "fail", message: err.message });
    }
  },
];

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      age,
      phone,
      password,
      levelOfEducation,
      profilePicture,
      salary,
      workingHours,
      workingDays,
      holidays,
      role,
      department,
      financial,
    } = req.body;

    // Find the employee to be updated
    const employee = await Employee.findById(id);
    const user = req.user;

    if (!employee) {
      return res.status(404).json({
        status: "fail",
        message: "Employee not found",
      });
    }
    // ss
    // Fetch the role of the user making the request
    const userRole = req.user.role; // Adjust based on how you store user's role
    const roleDoc = await Role.findById(userRole);

    if (!roleDoc) {
      return res.status(403).json({
        status: "fail",
        message: "Invalid role",
      });
    }
    const { permissions } = roleDoc;

    // Check if the user has the permission to update restricted fields
    const hasUpdateRestrictedPermission = permissions.includes(
      "update_employee_restricted"
    );

    if (
      user._id.toString() !== employee._id.toString() &&
      !hasUpdateRestrictedPermission
    ) {
      return res.status(403).json({
        status: "fail",
        message: "You are not authorized to update this employee",
      });
    }
    // Validate fields allowed for update based on permissions
    const updateFields = {
      age,
      phone,
      password,
      levelOfEducation,
      profilePicture,
      salary,
      workingHours,
      workingDays,
      holidays,
      role,
      department,
      financial,
    };

    for (const [key, value] of Object.entries(updateFields)) {
      4;
      if (value !== undefined) {
        if (!hasUpdateRestrictedPermission) {
          // Users without "update_employee_restricted" permission cannot update certain fields
          if (
            [
              "salary",
              "workingHours",
              "workingDays",
              "holidays",
              "role",
              "department",
              "financial",
            ].includes(key)
          ) {
            return res.status(403).json({
              status: "fail",
              message: `You are not allowed to update the ${key} field.`,
            });
          }
        } else {
          // Users with "update_employee_restricted" permission cannot update certain fields
          if (
            [
              "password",
              "age",
              "profilePicture",
              "levelOfEducation",
              "phone",
            ].includes(key)
          ) {
            return res.status(403).json({
              status: "fail",
              message: `You are not allowed to update the ${key} field. only Employee himself`,
            });
          }
        }
        employee[key] = value;
      }
    }

    const updatedEmployee = await employee.save();

    res.status(200).json({
      status: "success",
      data: updatedEmployee,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res
        .status(404)
        .json({ status: "fail", message: "Employee not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Employee successfully deleted",
      data: employee,
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// Create a new guest account and send email with credentials
exports.inviteEmployee = async (req, res) => {
  try {
    const { email, department, role, phone, salary } = req.body;
    console.log({ email, department, role, phone, salary });
    const roleDoc = await Role.findById(role);
    // Generate a random password for the new employee
    const password = generateRandomPassword();
    const name = email.split("@")[0];

    // Create the new employee
    const newEmployee = await Employee.create({
      name,
      email,
      password,
      department,
      role,
      phone,
      salary,
    });

    // Send the email with the credentials to the invited employee
    const transporter = nodemailer.createTransport({
      service: "gmail", // Example: using Gmail
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to the Dashboard",
      text: `Hello,\n\nYou have been invited as ${roleDoc.name}.\n\nHere are your credentials:\nEmail: ${email}\nPassword: ${password}\n\nPlease log in and change your password.\n\nBest regards,\nDashboard Team`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      status: "success",
      message: "Employee invited and email sent successfully.",
      data: newEmployee,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
