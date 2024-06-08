const express = require("express");
const ControllerFactory = require("../controller/controller-factory");
const validateRequest = require("../middlewares/validation");
const { customerSchema, baseUserSchema } = require("../validations/user");
const userUpload = require("../middlewares/multer.config");

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

router.patch("/:customerId/permission", (req, res, next) =>
  customerController.updateCustomerPermission(req, res, next)
);

router.patch(
  "/:customerId/image",
  userUpload.single("image"),
  (req, res, next) => customerController.updateCustomerImage(req, res, next)
);

module.exports = router;
