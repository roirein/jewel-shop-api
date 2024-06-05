const ServiceFactory = require("../services/service-factory");
const EmployeeController = require("./employee-controller");

class ControllerFactory {
  static createEmployeeController() {
    return new EmployeeController(ServiceFactory.getEmployeeService());
  }
}

module.exports = ControllerFactory;
