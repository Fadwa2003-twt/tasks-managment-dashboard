const express = require("express");
const roleController = require("../controllers/roleController");
const permissions = require("../middlewares/permissionsMiddleware");
const middlewares = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/")
  .post(
    middlewares.protect,
    permissions.restrictTo("Admin"),
    roleController.createRole
  ); // Admins only

router
  .route("/:roleId")
  .patch(
    middlewares.protect,
    permissions.restrictTo("Admin"),
    roleController.updateRole
  ); // Admins only

module.exports = router;
