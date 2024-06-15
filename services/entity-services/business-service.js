const HTTPError = require("../../errors/http-error");
const RESOURCES_TYPES = require("../../resource-manager/definitions");
const Service = require("../service");
const { isBusinessExists } = require("../utils/business");
const { checkUserExists } = require("../utils/user");
const BaseEntityService = require("./base-entity-service");

class BusinessService extends BaseEntityService {
  constructor() {
    super(RESOURCES_TYPES.BUSINESS);
  }

  async createBusiness(data) {
    await isBusinessExists(this.resourceManager, data);
    const {
      _id,
      businessNumber,
      businessName,
      businessEmail,
      businessPhoneNumber,
      address,
    } = await this.createResource(data);
    return {
      _id,
      businessNumber,
      businessName,
      businessEmail,
      businessPhoneNumber,
      address,
    };
  }

  async retrieveBusinesses(query = {}) {
    const fields = query.fields ? query.fields.replaceAll(",", " ") : undefined;
    const limit = query.limit ? parseInt(query.limit) : undefined;
    const skip = query.limit ? parseInt(query.skip) : undefined;
    const businesses = await this.searchResources({
      ...query,
      fields,
      limit,
      skip,
    });
    return businesses;
  }

  async getBusinessById(id, fields = "") {
    const business = await this.searchResourceById(
      id,
      fields.replaceAll(",", " ")
    );
    return business;
  }

  async deleteBusiness(id) {
    try {
      const business = await this.resourceManager.findById(
        RESOURCES_TYPES.BUSINESS,
        id
      );
      if (!business) {
        throw new HTTPError("No business matching the given id", "fail", 404);
      }
      //delete customers belongs to the business
      const customersPromises = business.customers.map((customer) => {
        return this.resourceManager.delete(RESOURCES_TYPES.CUSTOMER, customer);
      });
      await Promise.all(customersPromises);
      // delete business
      await this.resourceManager.delete(RESOURCES_TYPES.BUSINESS, id);
    } catch (err) {
      this.handleEntityServiceError(err);
    }
  }

  async updateBusiness(id, data) {
    await isBusinessExists(this.resourceManager, data, true, id);
    const updatedBusiness = await this.updateResource(id, data);
    if (!updatedBusiness) {
      throw new HTTPError("No business matching the given id", "fail", 404);
    }
    return updatedBusiness;
  }
}

module.exports = BusinessService;
