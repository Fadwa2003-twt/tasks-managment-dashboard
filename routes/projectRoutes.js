const express = require("express");
const projectController = require("../controllers/projectController");
const permissions = require("../middlewares/permissionsMiddleware");
const middlewares = require("../middlewares/authMiddleware");
const router = express.Router();

// Protect all routes
router.use(middlewares.protect);

router
  .route("/")
  .get(
    permissions.checkPermission("view_project"),
    projectController.getAllProjects
  )
  .post(
    permissions.checkPermission("create_project"),
    projectController.createProject
  );

router
  .route("/:id")
  .get(
    permissions.checkPermission("view_project"),
    projectController.getProject
  )
  .patch(
    permissions.checkPermission("update_project"),
    projectController.updateProject
  )
  .delete(
    permissions.checkPermission("delete_project"),
    projectController.deleteProject
  );

module.exports = router;
