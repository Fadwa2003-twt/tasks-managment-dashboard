const mongoose = require("mongoose");

// Define the chat group schema
const chatGroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: function () {
      return this.isGroupChat;
    }, // Groups require a name, but one-on-one chats don't
  },
  isGroupChat: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Custom validation to ensure at least one member is provided
chatGroupSchema.pre("save", function (next) {
  if (this.isGroupChat && (!this.members || this.members.length === 0)) {
    return next(new Error("A group chat must have at least one member."));
  }
  next();
});

module.exports = mongoose.model("ChatGroup", chatGroupSchema);
