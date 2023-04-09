const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://jaredgomez0812:Emanuel12@cluster0.o7elciy.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;