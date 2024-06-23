const HTTPError = require("../errors/http-error");

const authorize = (roles, ownershipParam = undefined) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new HTTPError("Unauthorized", "fail", 401);
      }
      const authErr = new HTTPError(
        "You do not have permission for accessing that resource",
        "fail",
        403
      );
      if (req.user.userType === "customer" && !roles.includes("customer")) {
        throw authErr;
      }
      if (req.user.userType === "employee" && !roles.includes(req.user.role)) {
        throw authErr;
      }
      if (
        ownershipParam &&
        req.params[ownershipParam] &&
        req.params[ownershipParam].toString() !== req.user._id.toString()
      ) {
        throw authErr;
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = authorize;
