const HTTPError = require("../errors/http-error");

const authorize = (authOptions) => {
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
      const userType = req.user.userType;
      if (!authOptions.allowedUserTypes.includes(userType)) {
        throw authErr;
      }
      if (authOptions.self) {
        const selfParam = userType === "customer" ? "customerId" : "employeeId";
        if (req.user._id.toString() !== req.params[selfParam]) {
          if (authOptions.self.only) {
            //only = true -means that no one but the logged in user should do this operations, else, we keep the check
            throw authErr;
          }
        }
      }
      if (userType === "employee") {
        const role = req.user.role;
        if (!authOptions.employeeRestrictions["roles"].includes(role)) {
          throw authErr;
        }
      }
      if (userType === "customer") {
        const dependency = authOptions.customerRestrictions["paramDependency"];
        if (dependency) {
          const dependecyParam = req.params[dependency];
          if (
            !dependecyParam ||
            req.user[dependency].toString() !== dependecyParam
          ) {
            throw authErr;
          }
        }
        if (
          authOptions.customerRestrictions["permission"] &&
          authOptions.customerRestrictions["permission"] !==
            req.user.permissionLevel
        ) {
          throw authErr;
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = authorize;
