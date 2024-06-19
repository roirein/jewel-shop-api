const { STATUS } = require("../../../consts/requests");
const HTTPError = require("../../../errors/http-error");
const RESOURCES_TYPES = require("../../../resource-manager/definitions");
const { isBusinessExists } = require("../utils/business");
const { checkContactInfoExists } = require("../utils/contact-info");
const BaseEntityService = require("./base-entity-service");

class RegistrationRequestService extends BaseEntityService {
  constructor() {
    super(RESOURCES_TYPES.REGISTRATION_REQUEST);
  }

  async createRequest(data) {
    try {
      await checkContactInfoExists(
        //check if user exists
        this.resourceManager,
        data.contactData.email,
        data.contactData.phoneNumber
      );
      await isBusinessExists(this.resourceManager, data); //check if business exists
      const requestQuery = {
        status: "pending",
        deletedAt: null,
        $or: [
          { "contactData.email": data.contactData.email },
          { "contactData.phoneNumber": data.contactData.phoneNumber },
          { "businessData.businessEmail": data.businessData.businessEmail },
          {
            "businessData.businessPhoneNumber":
              data.businessData.businessPhoneNumber,
          },
          { "businessData.businessNumber": data.businessData.businessNumber },
        ],
      };
      if (
        !!(await this.resourceManager.findOne(
          RESOURCES_TYPES.REGISTRATION_REQUEST,
          requestQuery
        ))
      ) {
        throw new HTTPError(
          "There is already pending request with some of the contact of business data you provided",
          "fail",
          409
        );
      }
      const { _id, businessData, contactData, status, description } =
        await this.resourceManager.createResource(
          RESOURCES_TYPES.REGISTRATION_REQUEST,
          data
        );
      const managerId = await this.resourceManager.findOne(
        RESOURCES_TYPES.EMPLOYEE,
        { role: "manager" },
        { fields: "_id" }
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
          notificationType: "registration-request",
          receiver: managerId,
          resourceId: _id,
          resourceType: "RegistrationRequest",
        }
      );
      this.eventEmitter.emitEvent({
        event: "notification",
        data: {
          type: notificationType,
          content: {
            read,
            createdAt,
            resourceType,
            resourceId,
            receiver,
          },
        },
      });
      return { _id, businessData, contactData, status, description };
    } catch (err) {
      this.handleEntityServiceError(err);
    }
  }

  async retriveRequests(query = {}) {
    const fields = query.fields ? query.fields.replaceAll(",", " ") : undefined;
    const limit = query.limit ? parseInt(query.limit) : undefined;
    const skip = query.limit ? parseInt(query.skip) : undefined;
    const requests = await this.searchResources({
      ...query,
      fields,
      limit,
      skip,
    });
    return requests;
  }

  async getRequestById(id, fields = "") {
    const request = await this.searchResourceById(
      id,
      fields.replaceAll(",", " ")
    );

    return request;
  }

  async respondRequest(requestId, data) {
    try {
      if (!Object.values(STATUS).includes(data.status)) {
        throw new HTTPError(
          "Status must be either pending, rejected, approved",
          "fail",
          400
        );
      }
      const updatedRequest = await this.resourceManager.update(
        RESOURCES_TYPES.REGISTRATION_REQUEST,
        requestId,
        data,
        "contactData businessData description status"
      );
      if (!updatedRequest) {
        throw new HTTPError(
          "The request you are trying to update does not exists",
          "fail",
          404
        );
      }
      if (updatedRequest.status === STATUS.APPROVED) {
        this.eventEmitter.emitEvent({
          event: "send-mail",
          data: {
            type: "approval",
            email: updatedRequest.contactData.email,
            name: `${updatedRequest.contactData.firstName} ${updatedRequest.contactData.lastName}`,
          },
        });
      }
      await this.resourceManager.delete(
        RESOURCES_TYPES.REGISTRATION_REQUEST,
        requestId,
        true
      );
      return updatedRequest;
    } catch (err) {
      this.handleEntityServiceError(err);
    }
  }

  async deleteRequest(requestId) {
    await this.deleteResource(requestId);
  }
}

module.exports = RegistrationRequestService;
