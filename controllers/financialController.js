const Financial = require("../models/financialModel");
const Employee = require("../models/employeeModel");
exports.getAllFinancials = async (req, res) => {
  try {
    const financials = await Financial.find()
      .populate("employee")
      .populate("department");
    res.status(200).json({ status: "success", data: financials });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.getFinancialByEmployee = async (req, res) => {
  try {
    const financial = await Financial.findOne({
      employee: req.params.employeeId,
    })
      .populate("employee")
      .populate("department");
    if (!financial) {
      return res
        .status(404)
        .json({ status: "fail", message: "No financial record found" });
    }
    res.status(200).json({ status: "success", data: financial });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.createFinancialRecord = async (req, res) => {
  const { employee, salary, bonuses, deductions } = req.body;

  try {
    const employeeRecord = await Employee.findById(employee);
    if (!employeeRecord) {
      return res
        .status(404)
        .json({ status: "fail", message: "Employee not found" });
    }
    const department = employeeRecord.department;
    const role = employeeRecord.role;
    const totalPayment = salary + (bonuses || 0) - (deductions || 0);
    const financial = new Financial({
      employee,
      salary,
      department,
      role,
      bonuses,
      deductions,
      totalPayment,
    });

    await financial.save();

    res.status(201).json({ status: "success", data: financial });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.updateFinancialRecord = async (req, res) => {
  const employeeId = req.params.id;
  console.log(employeeId);

  try {
    const financial = await Financial.findOne({
      employee: employeeId,
    });
    if (!financial) {
      return res
        .status(404)
        .json({ status: "fail", message: "Financial record not found" });
    }

    const employeeData = await Employee.findById(employeeId);
    if (!employeeData) {
      return res
        .status(404)
        .json({ status: "fail", message: "Employee not found" });
    }

    const updatedFinancial = await Financial.findByIdAndUpdate(
      financial._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ status: "success", data: updatedFinancial });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// Manage salary advance requests
exports.updateSalaryAdvanceStatus = async (req, res) => {
  try {
    const { employeeId, requestId } = req.params;
    const { status } = req.body;

    const financial = await Financial.findOne({ employee: employeeId });
    const salaryAdvance = financial.salaryAdvanceRequests.id(requestId);
    if (!salaryAdvance) {
      return res
        .status(404)
        .json({ status: "fail", message: "Salary advance request not found" });
    }

    salaryAdvance.status = status;
    await financial.save();

    res.status(200).json({ status: "success", data: financial });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
