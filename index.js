require("dotenv").config();
const express = require("express");
const parser = require("body-parser");

// create express app
const app = express();

// parse requests of application urlencoded
app.use(parser.urlencoded({ extended: true }));

// parse requests of application/json
app.use(parser.json());

//Database configuration
const mongoose = require("mongoose");
const connectDatabase = require("./config/databaseConfig");

connectDatabase;

app.get("/", (req, res) => {
  res.json({
    message:
      "Welcome!, this is the place where you can learn facts about states in the United States!"
  });
});
app.use("/states", require("./app/routes/routes"));
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
