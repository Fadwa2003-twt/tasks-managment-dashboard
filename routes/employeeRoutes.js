const express = require("express");
const employeeController = require("../controllers/employeeController");
const middlewares = require("../middlewares/authMiddleware");
const permissions = require("../middlewares/permissionsMiddleware");
const router = express.Router();

// Protect all routes
router.use(middlewares.protect);

router
  .route("/")
  .get(
    permissions.checkPermission("view_employee"),
    employeeController.getAllEmployees
  )
  .post(
    permissions.checkPermission("create_employee"),
    employeeController.createEmployee
  );

router
  .route("/:id")
  .get(
    permissions.checkPermission("view_employee"),
    employeeController.getEmployee
  )
  .patch(
    permissions.checkPermission("update_employee"),
    employeeController.updateEmployee
  )
  .delete(
    permissions.checkPermission("delete_employee"),
    employeeController.deleteEmployee
  );

router.post(
  "/invite",
  permissions.checkPermission("invite_employee"),
  employeeController.inviteEmployee
);

module.exports = router;
