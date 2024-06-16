const BusinessService = require("./entity-services/business-service");
const CustomerService = require("./entity-services/customer-service");
const EmployeeService = require("./entity-services/employee-service");
const RegistrationRequestService = require("./entity-services/registration-request-service");

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
}

module.exports = ServiceFactory;
