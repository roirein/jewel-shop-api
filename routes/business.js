const express = require("express");
const businessSchema = require("../validations/business");
const passport = require("passport");
const { authorize, validate } = require("../middlewares");
const { ControllerFactory } = require("../factories");
const { RESOURCES_TYPES } = require("../definitions");

const businessController = ControllerFactory.createController(
  RESOURCES_TYPES.BUSINESS
);
const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post(
  "/",
  authorize({
    allowedUserTypes: ["employee"],
    employeeRestrictions: { roles: ["manager"] },
  }),
  validate(businessSchema),
  (req, res, next) => businessController.createBusiness(req, res, next)
);

router.get(
  "/",
  authorize({
    allowedUserTypes: ["employee"],
    employeeRestrictions: { roles: ["manager"] },
  }),
  (req, res, next) => businessController.getAllBusiness(req, res, next)
);

router.get(
  "/:businessId",
  authorize({
    allowedUserTypes: ["employee", "customer"],
    employeeRestrictions: { roles: ["manager"] },
    customerRestrictions: { paramDependency: "businessId" },
  }),
  (req, res, next) => businessController.getBusinessById(req, res, next)
);

router.delete(
  "/:businessId",
  authorize({
    allowedUserTypes: ["employee", "customer"],
    employeeRestrictions: { roles: ["manager"] },
    customerRestrictions: { paramDependency: "businessId", permission: 5 },
  }), //customer will be able to delete only if he has the permission level mentiones
  (req, res, next) => businessController.deleteBusiness(req, res, next)
);

router.put(
  "/:businessId",
  validate(businessSchema),
  authorize({
    allowedUserTypes: ["customer"],
    customerRestrictions: { paramDependency: "businessId", permission: 5 },
  }),
  (req, res, next) => businessController.updateBusiness(req, res, next)
);

module.exports = router;
