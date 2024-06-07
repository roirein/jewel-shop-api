const express = require("express");
const ControllerFactory = require("../controller/controller-factory");

const router = express.Router();

const employeeController = ControllerFactory.createEmployeeController();
router.post("/", (req, res, next) =>
  employeeController.createEmployee(req, res, next)
);

router.get("/", (req, res, next) =>
  employeeController.getAllEmployees(req, res, next)
);

router.get("/:employeeId", (req, res, next) =>
  employeeController.getEmployeeById(req, res, next)
);

router.delete("/:employeeId", (req, res, next) =>
  employeeController.deleteEmployee(req, res, next)
);

router.put("/:employeeId", (req, res, next) =>
  employeeController.updateEmployee(req, res, next)
);

router.patch("/:employeeId/role", (req, res, next) =>
  employeeController.updateEmployeeRole(req, res, next)
);

module.exports = router;
