const path = require("path");
const multer = require("multer");
const HTTPError = require("../errors/http-error");

const createStorage = (folderPath) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", folderPath));
    },
    filename: function (req, file, cb) {
      const name = `${Date.now()}-${file.originalname}`;
      cb(null, name);
    },
  });
};

const userStorage = createStorage("images/users");
const sketchStorage = createStorage("images/sketches");

const createMulterOptions = (storage) => {
  return {
    storage,
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
  };
};

const userUpload = multer(createMulterOptions(userStorage));
const sketchUpload = multer(createMulterOptions(sketchStorage));

module.exports = { userUpload, sketchUpload };
