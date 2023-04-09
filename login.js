const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  hash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model("Login", loginSchema);
