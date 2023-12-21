const express = require("express");
const server = express();
const cors = require("cors");
const connect = require("./database/db");
const dotenv = require("dotenv");
const port = process.env.PORT || 8080;

//middlewares
dotenv.config();
server.use(cors());
server.use(express.json());

// Default route
server.get("/", (req, res) => {
  res.send("You are trapped already? Shame on you!");
});

// server routes
server.use("/api/", require("./api/auth"));
server.use("/api/", require("./api/business"));

//database connection
connect();

// starting the sever
server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
