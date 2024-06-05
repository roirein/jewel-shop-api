const EmployeeService = require("./employee-service");

class ServiceFactory {
  static getEmployeeService() {
    return new EmployeeService();
  }
}

module.exports = ServiceFactory;
