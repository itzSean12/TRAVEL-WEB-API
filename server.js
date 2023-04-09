const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
const connectDB = require("./db");
const User = require("./users");
const Login = require("./login");
const Flight = require("./flights");

connectDB();

app.use(cors());

app.get("/", (req, res) => {
  res.json("Working");
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }
    const newUser = new User({
      id: Math.floor(Math.random() * 1000000),
      name,
      email,
    });
    const savedUser = await newUser.save();

    const newLogin = new Login({
      id: Math.floor(Math.random() * 1000000),
      hash: password, // remember to hash
      email,
      name,
      _id: savedUser._id, // include the _id property of the saved user object
    });
    const savedLogin = await newLogin.save();

    res.json({ email: email, name: name, id: savedUser._id }); // include the _id property in the response body
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// app.post("/signup", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ error: "User already exists" });
//     }
//     const newUser = new User({
//       id: Math.floor(Math.random() * 1000000),
//       name,
//       email,
//     });
//     const savedUser = await newUser.save();

//     const newLogin = new Login({
//       id: Math.floor(Math.random() * 1000000),
//       hash: password, // remember to hash
//       email,
//       name,
//     });
//     const savedLogin = await newLogin.save();

//     res.json({ email: email, name: name });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const login = await Login.findOne({ email, hash: password });
    console.log(login);
    if (!login) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const user = await User.findOne({ email });
    res.json({ email: email, name: user.name, id: user.id, _id: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/addflight", async (req, res) => {
  try {
    const { userId, airline, departure, arrival, price, count } = req.body;
    console.log("userId:", userId);
    const user = await User.findById(userId);
    console.log("user:", user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const newFlight = new Flight({
      airline,
      departure,
      arrival,
      price,
      count: count,
      user: user._id,
    });
    await newFlight.save();
    res.json({ message: "Flight added to user's cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/flights/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const flights = await Flight.find({ user: userId });
    res.json(flights);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/flights/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await Flight.deleteMany({ user: user._id });
    res.status(200).send(`All flights for user ${userId} have been deleted.`);
  } catch (err) {
    console.log("user does not exist");
    res.status(500).send(err);
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
