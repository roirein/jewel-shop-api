const authorize = require("./authorization");
const passport = require("./authentication");
const uploads = require("./multer.config");
const validate = require("./validation");

module.exports = {
  authorize,
  passport,
  uploads,
  validate,
};
