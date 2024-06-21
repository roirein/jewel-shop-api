const Business = require("../models/business");
const Customer = require("../models/customer");
const Employee = require("../models/employee");
const Notification = require("../models/notification");
const RegistrationRequest = require("../models/registration-request");
const Token = require("../models/token");
const User = require("../models/user");
const RESOURCES_TYPES = require("./definitions");
const ResourceManager = require("./resource-manager");

const dbs = {
  [RESOURCES_TYPES.USER]: User,
  [RESOURCES_TYPES.EMPLOYEE]: Employee,
  [RESOURCES_TYPES.CUSTOMER]: Customer,
  [RESOURCES_TYPES.BUSINESS]: Business,
  [RESOURCES_TYPES.REGISTRATION_REQUEST]: RegistrationRequest,
  [RESOURCES_TYPES.NOTIFICATION]: Notification,
  [RESOURCES_TYPES.TOKEN]: Token
};

const resourceManager = new ResourceManager(dbs);

module.exports = resourceManager;
