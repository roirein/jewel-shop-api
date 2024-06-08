const HTTPError = require("./http-error");

class DBError extends Error {
  constructor(error) {
    super();
    console.log(error.code);
    this.type = "DBError";
    if (error.name) {
      this.subtype = error.name;
    }
    if (error.code) {
      if (error.code === 11000) {
        this.subtype = "DuplicationError";
      }
    }
    this.data = this.#setData(error);
  }

  #setData(error) {
    let result = {};
    if (error.name && error.name === "ValidationError") {
      Object.values(error.errors).forEach((val) => {
        result[val.properties.path] = val.properties.message;
      });
    }
    return result;
  }

  toHTTPError() {
    if (this.subtype === "ValidationError") {
      return new HTTPError(
        "Some of the input values are incorrect",
        "fail",
        400,
        this.data
      );
    }
    if (this.subtype === "DuplicationError") {
      return new HTTPError(
        "Some of the resource data already exists",
        "fail",
        409
      );
    }
  }
}

module.exports = DBError;
