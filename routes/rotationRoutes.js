const express = require("express");
const router = express.Router();
const permissions = require("../middlewares/permissionsMiddleware");
const middlewares = require("../middlewares/authMiddleware");
const rotationController = require("../controllers/rotationController");

router.use(middlewares.protect);

router.get(
  "/",
  permissions.checkPermission("rotation_manager"),
  rotationController.getAllRotations
); // Get all rotations
router.post(
  "/",
  permissions.checkPermission("rotation_manager"),
  rotationController.createRotation
); // Create a rotation
router.get(
  "/:month",
  permissions.checkPermission("rotation_manager"),
  rotationController.getRotationsByMonth
); // Get rotations by month
router.put(
  "/:id",
  permissions.checkPermission("rotation_manager"),
  rotationController.updateRotation
); // Update a rotation
router.delete(
  "/:id",
  permissions.checkPermission("rotation_manager"),
  rotationController.deleteRotation
); // Delete a rotation

module.exports = router;
