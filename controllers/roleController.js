const Role = require("../models/roleModel");

// Create a new role
exports.createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    console.log({ name, permissions });

    const role = await Role.create({ name, permissions });

    res.status(201).json({
      status: "success",
      data: role,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Update a role's permissions
exports.updateRole = async (req, res) => {
  try {
    const { permissions } = req.body;

    const role = await Role.findByIdAndUpdate(
      req.params.roleId,
      { permissions },
      {
        new: true, // Return the updated role
        runValidators: true,
      }
    );

    if (!role) {
      return res
        .status(404)
        .json({ status: "fail", message: "Role not found" });
    }

    res.status(200).json({
      status: "success",
      data: role,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
