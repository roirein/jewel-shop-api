const express = require("express");
const ControllerFactory = require("../controller/controller-factory");
const validateRequest = require("../middlewares/validation");
const { customerSchema } = require("../validations/user");

const customerController = ControllerFactory.createCustomerController();
const router = express.Router();

router.post("/", validateRequest(customerSchema), (req, res, next) =>
  customerController.createCustomer(req, res, next)
);

module.exports = router;
