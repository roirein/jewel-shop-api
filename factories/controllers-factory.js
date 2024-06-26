const {
  BusinessController,
  CustomerController,
  EmployeeController,
  RegistrationRequestController,
  AuthController,
  NotificationController,
  ModelController,
} = require("../controller");
const { RESOURCES_TYPES } = require("../definitions");
const RestServiceFactory = require("./rest-service-factory");

class ControllerFactory {
  static createController(resourceType) {
    const service = RestServiceFactory.createService(resourceType);
    switch (resourceType) {
      case RESOURCES_TYPES.BUSINESS:
        return new BusinessController(service);
      case RESOURCES_TYPES.CUSTOMER:
        return new CustomerController(service);
      case RESOURCES_TYPES.EMPLOYEE:
        return new EmployeeController(service);
      case RESOURCES_TYPES.NOTIFICATION:
        return new NotificationController(service);
      case RESOURCES_TYPES.REGISTRATION_REQUEST:
        return new RegistrationRequestController(service);
      case RESOURCES_TYPES.MODEL:
        return new ModelController(service);
      case "auth":
        return new AuthController(service);
      default:
        return null;
    }
  }
}

module.exports = ControllerFactory;
