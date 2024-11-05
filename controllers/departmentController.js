const Department = require("../models/departmentModel");

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate("manager");
    res.status(200).json({ status: "success", data: departments });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
exports.createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json({ status: "success", data: department });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    // .populate("employees")
    // .populate("projects");
    if (!department) {
      return res
        .status(404)
        .json({ status: "fail", message: "Department not found" });
    }
    res.status(200).json({ status: "success", data: department });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!department) {
      return res
        .status(404)
        .json({ status: "fail", message: "Department not found" });
    }
    res.status(200).json({ status: "success", data: department });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res
        .status(404)
        .json({ status: "fail", message: "Department not found" });
    }

    // Optionally, clear the department reference in related employees
    await Employee.updateMany(
      { department: req.params.id },
      { $unset: { department: "" } }
    );

    res.status(204).json({ status: "success", data: null }); // 204 No Content is appropriate for deletions
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
