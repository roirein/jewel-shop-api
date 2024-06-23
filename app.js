const path = require("path");
const express = require("express");
const { createServer } = require("http");
const mongoose = require("mongoose");
const socketio = require("socket.io");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const passport = require("./middlewares/passport.js/passport.config");
const employeeRouter = require("./routes/employee");
const customerRouter = require("./routes/customer");
const businessRouter = require("./routes/business");
const requestsRouter = require("./routes/registration-request");
const authRouter = require("./routes/auth");
const morgan = require("morgan");
const NotificationService = require("./services/notifications-service/notification-service");
require("./services/mail-service.js/mail-service");

const app = express();
const server = createServer(app);
const io = socketio(server);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(morgan("dev"));

const port = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URL);

app.use("/employee", employeeRouter);
app.use("/customer", customerRouter);
app.use("/business", businessRouter);
app.use("/request", requestsRouter);
app.use("/auth", authRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message,
    data: err.data || undefined,
  });
});

new NotificationService(io);

server.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
