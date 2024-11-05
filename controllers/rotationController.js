const Rotation = require("../models/rotationModel");
const Employee = require("../models/employeeModel"); // Import Employee model for validation

// Create a new rotation
exports.createRotation = async (req, res) => {
  try {
    const { employeeId, schedule, month } = req.body;

    // Check if the employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const rotation = new Rotation({ employee: employeeId, schedule, month });
    await rotation.save();

    res
      .status(201)
      .json({ message: "Rotation created successfully", rotation });
  } catch (error) {
    res.status(500).json({ message: "Failed to create rotation", error });
  }
};

// rotation_manager
// Get all rotations, with employee details populated
exports.getAllRotations = async (req, res) => {
  try {
    const rotations = await Rotation.find().populate("employee", "name age"); // Populates with selected employee fields
    res.status(200).json(rotations);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve rotations", error });
  }
};

// Get rotations by month
exports.getRotationsByMonth = async (req, res) => {
  try {
    const { month } = req.params;
    const rotations = await Rotation.find({ month }).populate(
      "employee",
      "name age"
    );
    res.status(200).json(rotations);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve rotations", error });
  }
};

// Update rotation
exports.updateRotation = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId, schedule, month } = req.body;

    // Verify if the employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const updatedRotation = await Rotation.findByIdAndUpdate(
      id,
      { employee: employeeId, schedule, month },
      { new: true }
    ).populate("employee");

    res
      .status(200)
      .json({ message: "Rotation updated successfully", updatedRotation });
  } catch (error) {
    res.status(500).json({ message: "Failed to update rotation", error });
  }
};

// Delete rotation
exports.deleteRotation = async (req, res) => {
  try {
    const { id } = req.params;
    await Rotation.findByIdAndDelete(id);
    res.status(200).json({ message: "Rotation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete rotation", error });
  }
};
