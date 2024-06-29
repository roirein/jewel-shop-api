const {
  User,
  Employee,
  Customer,
  Business,
  RegistrationRequest,
  Token,
  Notification,
  JewelModel,
} = require("../models");
const { RESOURCES_TYPES } = require("../definitions");
const ResourceManager = require("./resource-manager");

const dbs = {
  [RESOURCES_TYPES.USER]: User,
  [RESOURCES_TYPES.EMPLOYEE]: Employee,
  [RESOURCES_TYPES.CUSTOMER]: Customer,
  [RESOURCES_TYPES.BUSINESS]: Business,
  [RESOURCES_TYPES.REGISTRATION_REQUEST]: RegistrationRequest,
  [RESOURCES_TYPES.NOTIFICATION]: Notification,
  [RESOURCES_TYPES.TOKEN]: Token,
  [RESOURCES_TYPES.MODEL]: JewelModel,
};

const resourceManager = new ResourceManager(dbs);

module.exports = {
  resourceManager,
  ResourceManager,
};
