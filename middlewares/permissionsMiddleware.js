const Role = require("../models/roleModel");

exports.checkPermission = (action) => {
  return async (req, res, next) => {
    try {
      // Assuming req.user contains the authenticated user's information
      const role = await Role.findById(req.user.role);

      if (!role) {
        return res.status(403).json({
          status: "fail",
          message: "User's role does not exist",
        });
      }

      // Check if the role includes the required permission
      if (!role.permissions.includes(action)) {
        return res.status(403).json({
          status: "fail",
          message: "You do not have permission to perform this action",
        });
      }

      // Permission granted
      next();
    } catch (err) {
      res.status(500).json({ status: "fail", message: err.message });
    }
  };
};

exports.restrictTo = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const role = await Role.findById(req.user.role);

      if (!role) {
        return res.status(403).json({
          status: "fail",
          message: "User's role does not exist",
        });
      }

      // Check if the user's role is one of the allowed roles
      if (!allowedRoles.includes(role.name)) {
        return res.status(403).json({
          status: "fail",
          message: "You do not have permission to perform this action",
        });
      }

      next();
    } catch (err) {
      res.status(500).json({ status: "fail", message: err.message });
    }
  };
};
