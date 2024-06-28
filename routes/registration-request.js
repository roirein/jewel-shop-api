const express = require("express");
const validateRequest = require("../middlewares/validation");
const registrationRequestSchema = require("../validations/registration-request");
const passport = require("passport");
const authorize = require("../middlewares/authorization");
const { ControllerFactory } = require("../factories");
const { RESOURCES_TYPES } = require("../definitions");

const controller = ControllerFactory.createController(
  RESOURCES_TYPES.REGISTRATION_REQUEST
);
const router = express.Router();

router.post("/", validateRequest(registrationRequestSchema), (req, res, next) =>
  controller.createRequest(req, res, next)
);

router.use(passport.authenticate("jwt", { session: false }));
router.use(
  authorize({
    allowedUserTypes: ["employee"],
    employeeRestrictions: { roles: ["manager"] },
  })
);

router.get("/", (req, res, next) => controller.getAllRequests(req, res, next));

router.get("/:requestId", (req, res, next) =>
  controller.getRequestById(req, res, next)
);

router.patch("/:requestId/respond", (req, res, next) =>
  controller.respondRequest(req, res, next)
);

router.delete("/:requestId", (req, res, next) =>
  controller.deleteRequest(req, res, next)
);

module.exports = router;
