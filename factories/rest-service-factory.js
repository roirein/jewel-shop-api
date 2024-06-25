const { RESOURCES_TYPES } = require("../definitions");
const {
  BusinessService,
  CustomerService,
  EmployeeService,
  NotificationsService,
  RegistrationRequestService,
  AuthService,
} = require("../services");

class RestServiceFactory {
  static createService(resourceType) {
    switch (resourceType) {
      case RESOURCES_TYPES.BUSINESS:
        return new BusinessService();
      case RESOURCES_TYPES.CUSTOMER:
        return new CustomerService();
      case RESOURCES_TYPES.EMPLOYEE:
        return new EmployeeService();
      case RESOURCES_TYPES.NOTIFICATION:
        return new NotificationsService();
      case RESOURCES_TYPES.REGISTRATION_REQUEST:
        return new RegistrationRequestService();
      case "auth":
        return new AuthService();
      default:
        return null;
    }
  }
}

module.exports = RestServiceFactory;
