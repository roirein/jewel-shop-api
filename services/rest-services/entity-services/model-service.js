const BaseEntityService = require("./base-entity-service");
const { RESOURCES_TYPES } = require("../../../definitions");

class ModelService extends BaseEntityService {
  constructor() {
    super(RESOURCES_TYPES.MODEL);
  }
}

module.exports = ModelService;
