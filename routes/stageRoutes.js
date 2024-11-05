const express = require("express");
const stageController = require("../controllers/stageController");
const permissions = require("../middlewares/permissionsMiddleware");
const middlewares = require("../middlewares/authMiddleware");
const router = express.Router();

// Protect all routes
router.use(middlewares.protect);

// Routes for stages
router.post(
  "/tasks/:taskId/stages",
  permissions.checkPermission("create_stage"),
  stageController.createStage
);
router.get(
  "/tasks/:taskId/stages",
  permissions.checkPermission("view_stage"),
  stageController.getStagesByTask
);
router.put(
  "/stages/:stageId",
  permissions.checkPermission("update_stage"),
  stageController.updateStage
);
router.delete(
  "/tasks/:taskId/stages/:stageId",
  permissions.checkPermission("delete_stage"),
  stageController.deleteStage
);

module.exports = router;
