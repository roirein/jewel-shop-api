const express = require("express");
const validateRequest = require("../middlewares/validation");
const registrationRequestSchema = require("../validations/registration-request");
const ControllerFactory = require("../controller/controller-factory");

const controller = ControllerFactory.createRegistrationRequestController();
const router = express.Router();

router.post("/", validateRequest(registrationRequestSchema), (req, res, next) =>
  controller.createRequest(req, res, next)
);

module.exports = router;
