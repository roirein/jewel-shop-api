const {
  AuthService,
  BusinessService,
  EmployeeService,
  CustomerService,
  RegistrationRequestService,
} = require("./rest-services");
const NotificationService = require("./notifications-service");
const MailService = require("./mail-service/index.js");

module.exports = {
  AuthService,
  BusinessService,
  EmployeeService,
  CustomerService,
  RegistrationRequestService,
  NotificationService,
  MailService,
};
