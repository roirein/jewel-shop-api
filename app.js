const path = require("path");
const express = require("express");
const { createServer } = require("http");
const mongoose = require("mongoose");
const socketio = require("socket.io");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();
const passport = require("./middlewares/authentication");
const employeeRouter = require("./routes/employee");
const customerRouter = require("./routes/customer");
const businessRouter = require("./routes/business");
const requestsRouter = require("./routes/registration-request");
const authRouter = require("./routes/auth");
const notificationRouter = require("./routes/notification");
const morgan = require("morgan");
const { MailService, NotificationService } = require("./services");

const app = express();
const server = createServer(app);
const io = socketio(server);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

const port = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URL);

app.use("/employee", employeeRouter);
app.use("/customer", customerRouter);
app.use("/business", businessRouter);
app.use("/request", requestsRouter);
app.use("/auth", authRouter);
app.use("/notification", notificationRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message,
    data: err.data || undefined,
  });
});

const mailService = new MailService();
const notificationService = new NotificationService(io);
mailService.listen();
notificationService.listen();

server.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
