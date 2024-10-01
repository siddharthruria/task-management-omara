require("dotenv").config();
const express = require("express");
const connectToDB = require("./db");
var cors = require("cors");

connectToDB();

const app = express();

// allow server to handle requests from the client (back and forth)
app.use(cors());

// middleware to parse json data
app.use(express.json());

// importing routes
const authRoutes = require("./routes/auth");
const taskListRoutes = require("./routes/taskLists");
const taskRoutes = require("./routes/tasks");

// using the routes
app.use("/api/auth", authRoutes);
app.use("/api/taskLists", taskListRoutes);
app.use("/api/tasks", taskRoutes);

// home route
app.get("/", (req, res) => {
  res.send("welcome to the express application");
});

// running port for backend
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`server listening to requests on port: ${PORT}`);
});
