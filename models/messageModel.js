const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatGroup",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  file: {
    // Make sure this field exists
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
