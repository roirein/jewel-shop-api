const express = require("express");
const validateRequest = require("../middlewares/validation");
const businessSchema = require("../validations/business");
const ControllerFactory = require("../controller/controller-factory");
const passport = require("passport");
const authorize = require("../middlewares/authorization");

const businessController = ControllerFactory.createBusinessController();
const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));
router.use(authorize(["manager"]));

router.post("/", validateRequest(businessSchema), (req, res, next) =>
  businessController.createBusiness(req, res, next)
);

router.get("/", (req, res, next) =>
  businessController.getAllBusiness(req, res, next)
);

router.get("/:businessId", (req, res, next) =>
  businessController.getBusinessById(req, res, next)
);

router.delete("/:businessId", (req, res, next) =>
  businessController.deleteBusiness(req, res, next)
);

router.put("/:businessId", validateRequest(businessSchema), (req, res, next) =>
  businessController.updateBusiness(req, res, next)
);

module.exports = router;
