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
      console.log(err);
      if (err.type && err.type === "DBError") {
        throw err.toHTTPError();
      }
      throw err;
    }
  }
}

module.exports = BusinessService;
