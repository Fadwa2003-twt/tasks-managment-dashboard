const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Role name is required"],
    unique: true,
  },
  permissions: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Role", roleSchema);