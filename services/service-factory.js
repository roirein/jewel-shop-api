const BusinessService = require("./entity-services/business-service");
const CustomerService = require("./entity-services/customer-service");
const EmployeeService = require("./entity-services/employee-service");

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
}

module.exports = ServiceFactory;
