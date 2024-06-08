const express = require("express");
const ControllerFactory = require("../controller/controller-factory");
const validateRequest = require("../middlewares/validation");
const { customerSchema, baseUserSchema } = require("../validations/user");

const customerController = ControllerFactory.createCustomerController();
const router = express.Router();

router.post("/", validateRequest(customerSchema), (req, res, next) =>
  customerController.createCustomer(req, res, next)
);

router.get("/", (req, res, next) =>
  customerController.getAllCustomers(req, res, next)
);

router.get("/:customerId", (req, res, next) =>
  customerController.getCustomerById(req, res, next)
);

router.delete("/:customerId", (req, res, next) =>
  customerController.deleteCustomer(req, res, next)
);

router.put("/:customerId", validateRequest(baseUserSchema), (req, res, next) =>
  customerController.updateCustomer(req, res, next)
);

module.exports = router;
