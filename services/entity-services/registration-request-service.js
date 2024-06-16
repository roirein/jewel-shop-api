const HTTPError = require("../../errors/http-error");
const RESOURCES_TYPES = require("../../resource-manager/definitions");
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
          400
        );
      }
      const { businessData, contactData, status, description } =
        await this.resourceManager.createResource(
          RESOURCES_TYPES.REGISTRATION_REQUEST,
          data
        );
      return { businessData, contactData, status, description };
    } catch (err) {
      this.handleEntityServiceError(err);
    }
  }
}

module.exports = RegistrationRequestService;
