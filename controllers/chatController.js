const ChatGroup = require("../models/chatGroupModel");
const Message = require("../models/messageModel");
const multer = require("multer");
const path = require("path");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/chatFiles");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
exports.upload = multer({ storage });

// ------------------------- Message Management -------------------------

// Create a new message with file attachments
exports.sendMessage = async (req, res, io) => {
  try {
    const { chatGroup, content } = req.body;

    if (!chatGroup || !content) {
      return res.status(400).json({
        status: "fail",
        message: "chatGroup and content are required",
      });
    }

    // Handle file upload
    let fileUrl = null;
    if (req.file) {
      fileUrl = `/uploads/chatFiles/${req.file.filename}`;
    }

    // Save message in the database
    const message = await Message.create({
      chatGroup,
      sender: req.user.id,
      content,
      file: fileUrl, // Save the file URL
    });

    // Emit real-time message event to the room (chatGroup)
    io.to(chatGroup).emit("message", {
      chatGroup,
      sender: req.user.id,
      content,
      file: fileUrl,
      createdAt: message.createdAt,
    });

    res.status(201).json({
      status: "success",
      data: message,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Fetch paginated chat messages by group
exports.getMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { page = 1, limit = 10 } = req.query; // Default pagination values

    const messages = await Message.find({ chatGroup: groupId })
      .sort({ createdAt: -1 }) // Sort by newest messages
      .limit(limit * 1) // Limit number of results
      .skip((page - 1) * limit) // Skip to the appropriate page
      .populate("sender", "name"); // Include sender's name

    res.status(200).json({
      status: "success",
      results: messages.length,
      data: messages,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

// ------------------------- Chat Group Management -------------------------

// Create a new group (only for admins)
exports.createGroup = async (req, res) => {
  try {
    const { groupName, members } = req.body;
    const chatGroup = await ChatGroup.create({
      groupName,
      createdBy: req.user._id,
      members,
    });

    res.status(201).json({
      status: "success",
      data: chatGroup,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Create or find a one-on-one chat
exports.createOrFindOneOnOneChat = async (req, res, io) => {
  try {
    const { recipientId } = req.body;

    let chatGroup = await ChatGroup.findOne({
      isGroupChat: false,
      members: { $all: [req.user._id, recipientId] },
    });

    if (!chatGroup) {
      chatGroup = await ChatGroup.create({
        isGroupChat: false,
        createdBy: req.user._id,
        members: [req.user._id, recipientId],
      });
    }

    // Notify both users to join the chat room
    io.to(req.user._id.toString()).emit("joinRoom", chatGroup._id.toString());
    io.to(recipientId).emit("joinRoom", chatGroup._id.toString());

    res.status(200).json({
      status: "success",
      data: chatGroup,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getChatsForUser = async (req, res) => {
  try {
    // Retrieve chat groups for the logged-in user
    const chatGroups = await ChatGroup.find({ members: req.user._id });
    res.status(200).json({
      status: "success",
      data: chatGroups,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
