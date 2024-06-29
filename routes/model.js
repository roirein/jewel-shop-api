const express = require("express");
const passport = require("passport");
const { ControllerFactory } = require("../factories");
const { RESOURCES_TYPES } = require("../definitions");
const { authorize, uploads, validate } = require("../middlewares");
const modelSchema = require("../validations/model");

const router = express.Router();
const controller = ControllerFactory.createController(RESOURCES_TYPES.MODEL);
router.use(passport.authenticate("jwt", { session: false }));

router.post(
  "/",
  authorize({
    allowedUserTypes: ["employee"],
    employeeRestrictions: { roles: ["manager", "designer"] },
  }),
  uploads.sketchUpload.single("image"),
  validate(modelSchema),
  (req, res, next) => controller.createModel(req, res, next)
);

module.exports = router;
