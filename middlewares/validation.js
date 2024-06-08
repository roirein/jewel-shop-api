const HTTPError = require("../errors/http-error");

const validateRequest = (validationSchema) => {
  return async (req, res, next) => {
    try {
      console.log(123);
      await validationSchema.validate(req.body, { abortEarly: false });
      next();
    } catch (err) {
      const errors = {};
      err.inner.forEach((e) => {
        errors[e.path] = e.errors[0];
      });
      const error = new HTTPError(
        "Some the input parameters are invalid",
        "fail",
        400,
        errors
      );
      next(error);
    }
  };
};

module.exports = validateRequest;
