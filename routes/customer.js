const express = require("express");
const { customerSchema, baseUserSchema } = require("../validations/user");
const passport = require("passport");
const { uploads, authorize, validate } = require("../middlewares");
const { ControllerFactory } = require("../factories");
const { RESOURCES_TYPES } = require("../definitions");

const customerController = ControllerFactory.createController(
  RESOURCES_TYPES.CUSTOMER
);
const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post(
  "/:businessId",
  authorize({
    allowedUserTypes: ["employee", "customer"],
    employeeRestrictions: { roles: ["manager"] },
    customerRestrictions: { paramDependency: "businessId", permission: 5 },
  }),
  validate(customerSchema),
  (req, res, next) => customerController.createCustomer(req, res, next)
);

router.get(
  "/",
  authorize({
    allowedUserTypes: ["employee"],
    employeeRestrictions: { roles: ["manager"] },
  }),
  (req, res, next) => customerController.getAllCustomers(req, res, next)
);

router.get(
  "/:customerId",
  authorize({
    allowedUserTypes: ["employee", "customer"],
    employeeRestrictions: { roles: ["manager"] },
    customerRestrictions: { permission: 5 },
    self: {
      only: false,
    },
  }),
  (req, res, next) => customerController.getCustomerById(req, res, next)
);

router.delete(
  "/:customerId",
  authorize({
    allowedUserTypes: ["employee", "customer"],
    employeeRestrictions: { roles: ["manager"] },
    customerRestrictions: { permission: 5 },
    self: {
      only: false,
    },
  }),
  (req, res, next) => customerController.deleteCustomer(req, res, next)
);

router.put(
  "/:customerId",
  authorize({
    allowedUserTypes: ["customer"],
    self: {
      only: true,
    },
  }),
  validate(baseUserSchema),
  (req, res, next) => customerController.updateCustomer(req, res, next)
);

router.patch(
  "/:customerId/permission",
  authorize({
    allowedUserTypes: ["customer"],
    customerRestrictions: { permission: 5 },
  }),
  (req, res, next) =>
    customerController.updateCustomerPermission(req, res, next)
);

router.patch(
  "/:customerId/image",
  authorize(
    authorize({
      allowedUserTypes: ["customer"],
      self: {
        only: true,
      },
    })
  ),
  uploads.userUpload.single("image"),
  (req, res, next) => customerController.updateCustomerImage(req, res, next)
);

module.exports = router;
