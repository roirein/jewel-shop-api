const path = require("path");
const multer = require("multer");
const HTTPError = require("../errors/http-error");

const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "images/users"));
  },
  filename: function (req, file, cb) {
    const name = `${Date.now()}-${file.originalname}`;
    cb(null, name);
  },
});

const userUpload = multer({
  storage: userStorage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new HTTPError("Only images are allowed!", "fail", 400));
    }
  },
});

module.exports = userUpload;
