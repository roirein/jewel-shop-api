const AuthService = require("./rest-services/auth/auth-service");
const BusinessService = require("./rest-services/entity-services/business-service");
const CustomerService = require("./rest-services/entity-services/customer-service");
const EmployeeService = require("./rest-services/entity-services/employee-service");
const RegistrationRequestService = require("./rest-services/entity-services/registration-request-service");

class ServiceFactory {
  static getEmployeeService() {
    return new EmployeeService();
  }

  static getCustomerService() {
    return new CustomerService();
  }

  static getBusinessService() {
    return new BusinessService();
  }

  static getRegistrationRequestService() {
    return new RegistrationRequestService();
  }

  static getAuthService() {
    return new AuthService();
  }
}

module.exports = ServiceFactory;
