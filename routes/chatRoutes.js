// routes/chatRoutes.js
const express = require("express");
const chatController = require("../controllers/chatController");
const permissions = require("../middlewares/permissionsMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const { upload } = require("../controllers/chatController");

// Protect all routes
router.use(authMiddleware.protect);

// Routes for sending and retrieving messages
router.post("/createOneOnOneChat", chatController.createOrFindOneOnOneChat);
router.get("/getChats", chatController.getChatsForUser);
router.post("/sendMessage", upload.single("file"), chatController.sendMessage);
router.get("/getMessages/:groupId", chatController.getMessages);
router.post(
  "/createGroup",

  permissions.restrictTo("Admin"),
  chatController.createGroup
);

module.exports = router;
