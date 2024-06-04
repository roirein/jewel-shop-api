const express = require("express");
const mongoose = require("mongoose");
const Employee = require("./models/employee");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URL).then(() => {
  // Employee.create({
  //   firstName: "Roi",
  //   lastName: "Reinshtein",
  //   email: "roirein@gmail.com",
  //   phoneNumber: "0547224004",
  //   password: "Roi6431368",
  //   role: "manager",
  // }).then((res) => console.log(res));
});

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
