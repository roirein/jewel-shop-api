const ServiceFactory = require("../services/service-factory");
const CustomerController = require("./customer-controller");
const EmployeeController = require("./employee-controller");

class ControllerFactory {
  static createEmployeeController() {
    return new EmployeeController(ServiceFactory.getEmployeeService());
  }

  static createCustomerController() {
    return new CustomerController(ServiceFactory.getCustomerService());
  }
}

module.exports = ControllerFactory;
