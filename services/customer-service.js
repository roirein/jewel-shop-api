const HTTPError = require("../errors/http-error");
const RESOURCES_TYPES = require("../resource-manager/definitions");
const Service = require("./service");
const {
  checkUserExists,
  checkUniqneUpdateData,
  generatePassword,
  updateImage,
} = require("./utils/user");

class CustomerService extends Service {
  constructor() {
    super(RESOURCES_TYPES.CUSTOMER);
  }

  async createCustomer(data) {
    try {
      await checkUserExists(this.resourceManager, data);
      const userData = { ...data, password: generatePassword() };
      const customer = await this._create(userData);
      const {
        _id,
        firstName,
        lastName,
        email,
        phoneNumber,
        permissionLevel,
        imagePath,
      } = customer;
      const business = await this.resourceManager.findById(
        RESOURCES_TYPES.BUSINESS,
        data.businessId
      );
      await this.resourceManager.update(
        RESOURCES_TYPES.BUSINESS,
        business._id,
        {
          ...business,
          customers: [...business.customers, _id],
        }
      );
      return {
        _id,
        firstName,
        lastName,
        email,
        phoneNumber,
        imagePath,
        permissionLevel,
      };
    } catch (err) {
      if (err.type && err.type === "DBError") {
        throw err.toHTTPError();
      }
      throw err;
    }
  }

  async getAllCustomers(query = {}) {
    try {
      return await this._getAll(query);
    } catch (err) {
      throw err;
    }
  }

  async getCustomerById(id, query = {}) {
    try {
      const customer = await this._getById(id, query);
      if (!customer) {
        throw new HTTPError("No customer matching the given id", "fail", 404);
      }
      return customer;
    } catch (err) {
      throw err;
    }
  }

  async deleteCustomer(id) {
    try {
      const customer = await this._getById(id);
      if (!customer) {
        throw new HTTPError("No customer matching the given id", "fail", 404);
      }
      const business = await this.resourceManager.findById(
        RESOURCES_TYPES.BUSINESS,
        customer.businessId
      );
      await this.resourceManager.update(
        RESOURCES_TYPES.BUSINESS,
        business._id,
        {
          ...business,
          customers: business.customers.filter(
            (customerId) => customerId.toString() !== id
          ),
        }
      );
      await this._delete(id);
    } catch (err) {
      throw err;
    }
  }

  async updateCustomer(id, data) {
    try {
      await checkUniqneUpdateData(this.resourceManager, id, data);
      const fields =
        "_id firstName lastName email phoneNumber imagePath permissionLevel";
      const updatedUser = await this._update(id, data, fields);
      if (!updatedUser) {
        throw new HTTPError("No customer matching the given id", "fail", 404);
      }
      return updatedUser;
    } catch (err) {
      if (err.type && err.type === "DBError") {
        throw err.toHTTPError();
      }
      throw err;
    }
  }

  async updateCustomerPermission(id, data) {
    try {
      if (data.permissionLevel > 5 || data.permissionLevel < 1) {
        throw new HTTPError(
          "Permission level must be between 1 to 5",
          "fail",
          400
        );
      }
      return this.updateCustomer(id, data);
    } catch (err) {
      throw err;
    }
  }

  async updateCustomerImage(id, newImage) {
    const customer = await this._getById(id);
    if (!customer) {
      throw new HTTPError("No customer matching the given Id", "fail", 404);
    }
    await updateImage(customer);
    const updatedUser = await this.updateCustomer(id, {
      imagePath: newImage,
    });
    return updatedUser;
  }
}

module.exports = CustomerService;
