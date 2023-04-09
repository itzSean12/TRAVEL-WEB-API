const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({
  airline: String,
  departure: {
    airport: String,
    terminal: String,
    scheduled: Date,
  },
  arrival: {
    airport: String,
    terminal: String,
    scheduled: Date,
  },
  price: Number,
  count: Number,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Flight", flightSchema);
