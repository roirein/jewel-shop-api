const BaseEntityService = require("./base-entity-service");
const { RESOURCES_TYPES } = require("../../../definitions");
const { HTTPError } = require("../../../errors");
const { ROLES } = require("../../../consts/employees");

class ModelService extends BaseEntityService {
  constructor() {
    super(RESOURCES_TYPES.MODEL);
  }

  async createModel(data, userRole) {
    if (!!(await this.resourceManager.findOne({ title: data.title }))) {
      throw new HTTPError(
        "There is already a model with this title",
        "fail",
        409
      );
    }
    const {
      _id,
      title,
      description,
      sketch,
      internal,
      setting,
      allowedSettings,
      gold,
      alllowedGolds,
      desginer,
    } = this.createResource({
      ...data,
      status: userRole === ROLES.DESIGNER ? "created" : "approved",
    });
    if (userRole === ROLES.DESIGNER) {
      //send motification to the manager in case the model wasn't created by him
      const managerId = await this.resourceManager.findOne(
        RESOURCES_TYPES.EMPLOYEE,
        { role: "manager" },
        "_id"
      );
      const {
        notificationType,
        read,
        createdAt,
        resourceType,
        resourceId,
        receiver,
      } = await this.resourceManager.createResource(
        RESOURCES_TYPES.NOTIFICATION,
        {
          notificationType: "new-model-design",
          receiver: managerId._id,
          resourceId: _id,
          resourceType: "JewelModel",
        }
      );
      this.eventEmitter.emitEvent({
        event: "notification",
        data: {
          type: notificationType,
          userId: managerId._id.toString(),
          content: {
            read,
            createdAt,
            resourceType,
            resourceId,
            receiver,
          },
        },
      });
    }
    return {
      _id,
      title,
      description,
      sketch,
      internal,
      setting,
      allowedSettings,
      gold,
      alllowedGolds,
      desginer,
    };
  }
}

module.exports = ModelService;
