const express = require("express");
const router = express.Router();
const permissions = require("../middlewares/permissionsMiddleware");
const middlewares = require("../middlewares/authMiddleware");
const rotationRequestController = require("../controllers/rotationRequestController");

router.use(middlewares.protect);

router.get(
  "/rotation/request",
  rotationRequestController.getAllRotationRequests
);

// Route to create a new rotation request
router.post(
  "/rotation/request",
  rotationRequestController.createRotationRequest
);

// Route to approve or reject a rotation request
router.patch(
  "/rotation/request/:id",
  rotationRequestController.approveOrRejectRequest
);

module.exports = router;
