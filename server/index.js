require("dotenv").config();
const express = require("express");
const connectToDB = require("./db");
var cors = require("cors");

connectToDB();

// running port for backend
const PORT = process.env.PORT || 4000;

const app = express();

// allow server to handle requests from client
app.use(cors());

// middleware to parse json in requests
app.use(express.json());

// importing routes
const authRoutes = require("./routes/auth");
// const userRoutes = require("./routes/user");

// using the routes
app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);

// home route
app.get("/", (req, res) => {
  res.send("welcome to the express application");
});

app.listen(PORT, () => {
  console.log(`server listening to requests on port: ${PORT}`);
});
