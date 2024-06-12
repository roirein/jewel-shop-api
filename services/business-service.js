const HTTPError = require("../errors/http-error");
const RESOURCES_TYPES = require("../resource-manager/definitions");
const Service = require("./service");
const { isBusinessExists } = require("./utils/business");
const { checkUserExists } = require("./utils/user");

class BusinessService extends Service {
  constructor() {
    super(RESOURCES_TYPES.BUSINESS);
  }

  async createBusiness(data) {
    try {
      await isBusinessExists(this.resourceManager, data);
      await checkUserExists(this.resourceManager, data);
      const {
        _id,
        businessNumber,
        businessName,
        businessEmail,
        businessPhoneNumber,
        address,
      } = await this._create(data);
      return {
        _id,
        businessNumber,
        businessName,
        businessEmail,
        businessPhoneNumber,
        address,
      };
    } catch (err) {
      if (err.type && err.type === "DBError") {
        throw err.toHTTPError();
      }
      throw err;
    }
  }

  async deleteBusiness(id) {
    try {
      const business = await this._getById(id);
      if (!business) {
        throw new HTTPError("No business matching the given id", "fail", 404);
      }
      //delete customers belongs to the business
      const customersPromises = business.customers.map((customer) => {
        return this.resourceManager.delete(RESOURCES_TYPES.CUSTOMER, customer);
      });
      await Promise.all(customersPromises);
      // delete business
      await this._delete(id);
    } catch (err) {
      throw err;
    }
  }

  async updateBusiness(id, data) {
    try {
      const query = {
        _id: { $ne: id },
        $or: [
          { businessEmail: data.businessEmail },
          { phoneNumber: data.businessPhoneNumber },
          { businessNumber: data.businessNumber },
        ],
      };
      if (
        !!(await this.resourceManager.findOne(RESOURCES_TYPES.BUSINESS, query))
      ) {
        throw new HTTPError(
          "Your business details already exists",
          "fail",
          409
        );
      }
      const updatedBusiness = await this._update(id, data);
      if (!updatedBusiness) {
        throw new HTTPError("No customer matching the given id", "fail", 404);
      }
      return updatedBusiness;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = BusinessService;
