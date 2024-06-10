const BusinessService = require("./business-service");
const CustomerService = require("./customer-service");
const EmployeeService = require("./employee-service");

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
