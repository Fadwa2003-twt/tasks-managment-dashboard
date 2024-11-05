const express = require("express");
const taskController = require("../controllers/taskController");
const permissions = require("../middlewares/permissionsMiddleware");
const middlewares = require("../middlewares/authMiddleware");
const router = express.Router();

// Protect all routes
router.use(middlewares.protect);

router
  .route("/")
  .get(permissions.checkPermission("view_task"), taskController.getAllTasks)
  .post(permissions.checkPermission("create_task"), taskController.createTask);

router
  .route("/:id")
  .get(permissions.checkPermission("view_task"), taskController.getTask)
  .patch(permissions.checkPermission("update_task"), taskController.updateTask)
  .delete(
    permissions.checkPermission("delete_task"),
    taskController.deleteTask
  );

module.exports = router;
