const express = require("express");
const mongoose = require("mongoose");
const Employee = require("./models/employee");
require("dotenv").config();
const employeeRouter = require("./routes/employee");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URL);

app.use("/employee", employeeRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message,
  });
});

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
