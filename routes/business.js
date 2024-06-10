const express = require("express");
const validateRequest = require("../middlewares/validation");
const businessSchema = require("../validations/business");
const ControllerFactory = require("../controller/controller-factory");

const businessController = ControllerFactory.createBusinessController();
const router = express.Router();

router.post("/", validateRequest(businessSchema), (req, res, next) =>
  businessController.createBusiness(req, res, next)
);

module.exports = router;
