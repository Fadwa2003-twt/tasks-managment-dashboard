const express = require("express");
const departmentController = require("../controllers/departmentController");
const permissions = require("../middlewares/permissionsMiddleware");
const middlewares = require("../middlewares/authMiddleware");
const router = express.Router();

// Protect all routes
router.use(middlewares.protect);

router
  .route("/")
  .get(
    permissions.checkPermission("view_department"),
    departmentController.getAllDepartments
  )
  .post(
    permissions.checkPermission("create_department"),
    departmentController.createDepartment
  );

router
  .route("/:id")
  .get(
    permissions.checkPermission("view_department"),
    departmentController.getDepartment
  )
  .patch(
    permissions.checkPermission("update_department"),
    departmentController.updateDepartment
  )
  .delete(
    permissions.checkPermission("delete_department"),
    departmentController.deleteDepartment
  );

module.exports = router;
