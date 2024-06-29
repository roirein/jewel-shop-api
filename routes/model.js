const express = require("express");
const { ControllerFactory } = require("../factories");
const { RESOURCES_TYPES } = require("../definitions");

const router = express.Router();
const controller = ControllerFactory.createController(RESOURCES_TYPES.MODEL);

module.exports = router;
