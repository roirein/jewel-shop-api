const express = require("express");
const validateRequest = require("../middlewares/validation");
const { employeeSchema, baseUserSchema } = require("../validations/user");
const { uploads, authorize } = require("../middlewares");
const passport = require("passport");
const { ControllerFactory } = require("../factories");
const { RESOURCES_TYPES } = require("../definitions");

const router = express.Router();

const employeeController = ControllerFactory.createController(
  RESOURCES_TYPES.EMPLOYEE
);

router.use(passport.authenticate("jwt", { session: false }));

router.post(
  "/",
  authorize({
    allowedUserTypes: ["employee"],
    employeeRestrictions: { roles: ["manager"] },
  }),
  uploads.userUpload.single("image"),
  validateRequest(employeeSchema),
  (req, res, next) => employeeController.createEmployee(req, res, next)
);

router.get(
  "/",
  authorize({
    allowedUserTypes: ["employee"],
    employeeRestrictions: { roles: ["manager"] },
  }),
  (req, res, next) => employeeController.getAllEmployees(req, res, next)
);

router.get(
  "/:employeeId",
  authorize({
    allowedUserTypes: ["employee"],
    employeeRestrictions: { roles: ["manager"] },
    self: {
      only: false,
    },
  }),
  (req, res, next) => employeeController.getEmployeeById(req, res, next)
);

router.delete(
  "/:employeeId",
  authorize({
    allowedUserTypes: ["employee"],
    employeeRestrictions: { roles: ["manager"] },
  }),
  (req, res, next) => employeeController.deleteEmployee(req, res, next)
);

router.put(
  "/:employeeId",
  validateRequest(baseUserSchema),
  authorize({
    allowedUserTypes: ["employee"],
    self: {
      only: true,
    },
  }),
  (req, res, next) => employeeController.updateEmployee(req, res, next)
);

router.patch(
  "/:employeeId/role",
  authorize({
    allowedUserTypes: ["employee"],
    employeeRestrictions: { roles: ["manager"] },
  }),
  (req, res, next) => employeeController.updateEmployeeRole(req, res, next)
);

router.patch(
  "/:employeeId/image",
  authorize({
    allowedUserTypes: ["employee"],
    employeeRestrictions: { roles: ["manager"] },
    self: {
      only: true,
    },
  }),
  uploads.userUpload.single("image"),
  (req, res, next) => employeeController.updateEmployeeImage(req, res, next)
);

module.exports = router;
