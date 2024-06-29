const {
  AuthService,
  BusinessService,
  EmployeeService,
  CustomerService,
  RegistrationRequestService,
  NotificationsService,
  ModelService,
} = require("./rest-services");
const NotificationService = require("./notifications-service");
const MailService = require("./mail-service/index.js");

module.exports = {
  AuthService,
  BusinessService,
  EmployeeService,
  CustomerService,
  RegistrationRequestService,
  NotificationsService,
  NotificationService,
  MailService,
  ModelService,
};
