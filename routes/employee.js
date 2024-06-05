const express = require("express");
const ControllerFactory = require("../controller/controller-factory");

const router = express.Router();

const employeeController = ControllerFactory.createEmployeeController();
router.post("/", (req, res, next) =>
  employeeController.createEmployee(req, res, next)
);

module.exports = router;
