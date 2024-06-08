const HTTPError = require("./http-error");

class DBError extends Error {
  constructor(error) {
    super();
    console.log(error.code);
    this.type = "DBError";
    this.subtype = this.#setSubType(error);
    this.data = this.#setData(error);
  }

  #setSubType(error) {
    if (error.name) {
      return error.name;
    }
    if (error.code) {
      switch (code) {
        case 11000:
          return "DuplicationError";
        default:
          return "Unknown";
      }
    }
    return "Unknown";
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
    switch (this.subtype) {
      case "ValidationError": {
        return new HTTPError(
          "Some of the input values are incorrect",
          "fail",
          400,
          this.data
        );
      }
      case "DuplicationError": {
        return new HTTPError(
          "Some of the resource data already exists",
          "fail",
          409
        );
      }
      case "Unknown":
        return new HTTPError("Server Error", "error", 500);
      default:
        return new HTTPError("Server Error", "error", 500);
    }
  }
}

module.exports = DBError;
