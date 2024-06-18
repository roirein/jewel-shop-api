const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const employeeRouter = require("./routes/employee");
const customerRouter = require("./routes/customer");
const businessRouter = require("./routes/business");
const requestsRouter = require("./routes/registration-request");
const morgan = require("morgan");
require("./services/mail-service.js/mail-service");

const app = express();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(morgan("dev"));

const port = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URL);

app.use("/employee", employeeRouter);
app.use("/customer", customerRouter);
app.use("/business", businessRouter);
app.use("/request", requestsRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message,
    data: err.data || undefined,
  });
});

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
