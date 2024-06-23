const express = require("express");
const ControllerFactory = require("../controller/controller-factory");
const validateRequest = require("../middlewares/validation");
const { employeeSchema, baseUserSchema } = require("../validations/user");
const userUpload = require("../middlewares/multer.config");
const passport = require("passport");
const authorize = require("../middlewares/authorization");

const router = express.Router();

const employeeController = ControllerFactory.createEmployeeController();

router.use(passport.authenticate("jwt", { session: false }));

router.post(
  "/",
  authorize(["manager"]),
  userUpload.single("image"),
  validateRequest(employeeSchema),
  (req, res, next) => employeeController.createEmployee(req, res, next)
);

router.get("/", authorize(["manager"]), (req, res, next) =>
  employeeController.getAllEmployees(req, res, next)
);

router.get("/:employeeId", authorize(["manager"]), (req, res, next) =>
  employeeController.getEmployeeById(req, res, next)
);

router.delete("/:employeeId", authorize(["manager"]), (req, res, next) =>
  employeeController.deleteEmployee(req, res, next)
);

router.put(
  "/:employeeId",
  validateRequest(baseUserSchema),
  authorize([], "employeeId"),
  (req, res, next) => employeeController.updateEmployee(req, res, next)
);

router.patch("/:employeeId/role", authorize(["manager"]), (req, res, next) =>
  employeeController.updateEmployeeRole(req, res, next)
);

router.patch(
  "/:employeeId/image",
  authorize([], "employeeId"),
  userUpload.single("image"),
  (req, res, next) => employeeController.updateEmployeeImage(req, res, next)
);

module.exports = router;
