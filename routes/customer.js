const express = require("express");
const ControllerFactory = require("../controller/controller-factory");
const validateRequest = require("../middlewares/validation");
const { customerSchema, baseUserSchema } = require("../validations/user");
const passport = require("passport");
const { uploads, authorize } = require("../middlewares");

const customerController = ControllerFactory.createCustomerController();
const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post(
  "/:businessId",
  authorize(["manager"]),
  validateRequest(customerSchema),
  (req, res, next) => customerController.createCustomer(req, res, next)
);

router.get("/", authorize(["manager"]), (req, res, next) =>
  customerController.getAllCustomers(req, res, next)
);

router.get(
  "/:customerId",
  authorize(["manager"], "customerId"),
  (req, res, next) => customerController.getCustomerById(req, res, next)
);

router.delete(
  "/:customerId",
  authorize(["manager"], "customerId"),
  (req, res, next) => customerController.deleteCustomer(req, res, next)
);

router.put(
  "/:customerId",
  authorize([], "customerId"),
  validateRequest(baseUserSchema),
  (req, res, next) => customerController.updateCustomer(req, res, next)
);

router.patch(
  "/:customerId/permission",
  (
    req,
    res,
    next //handle authorization after refactor
  ) => customerController.updateCustomerPermission(req, res, next)
);

router.patch(
  "/:customerId/image",
  authorize([], "customerId"),
  uploads.userUpload.single("image"),
  (req, res, next) => customerController.updateCustomerImage(req, res, next)
);

module.exports = router;
