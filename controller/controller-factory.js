const ServiceFactory = require("../services/service-factory");
const AuthController = require("./auth-controller");
const BusinessController = require("./business-controller");
const CustomerController = require("./customer-controller");
const EmployeeController = require("./employee-controller");
const RegistrationRequestController = require("./registration-request-controller");

class ControllerFactory {
  static createEmployeeController() {
    return new EmployeeController(ServiceFactory.getEmployeeService());
  }

  static createCustomerController() {
    return new CustomerController(ServiceFactory.getCustomerService());
  }

  static createBusinessController() {
    return new BusinessController(ServiceFactory.getBusinessService());
  }

  static createRegistrationRequestController() {
    return new RegistrationRequestController(
      ServiceFactory.getRegistrationRequestService()
    );
  }

  static createAuthController() {
    return new AuthController(ServiceFactory.getAuthService());
  }
}

module.exports = ControllerFactory;
