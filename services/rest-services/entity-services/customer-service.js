const HTTPError = require("../../../errors/http-error");
const RESOURCES_TYPES = require("../../../resource-manager/definitions");
const { checkContactInfoExists } = require("../utils/contact-info");
const { generatePassword, updateImage } = require("../utils/user");
const BaseEntityService = require("./base-entity-service");

class CustomerService extends BaseEntityService {
  constructor() {
    super(RESOURCES_TYPES.CUSTOMER);
  }

  async createCustomer(data, businessId) {
    try {
      const business = await this.resourceManager.findById(
        RESOURCES_TYPES.BUSINESS,
        businessId
      );
      if (!business) {
        throw new HTTPError(
          "You trying to add customer to business which does not exists",
          "fail",
          404
        );
      }
      await checkContactInfoExists(
        this.resourceManager,
        data.email,
        data.phoneNumber
      );
      const password = generatePassword();
      const userData = { ...data, password, businessId };
      const customer = await this.resourceManager.createResource(
        RESOURCES_TYPES.CUSTOMER,
        userData
      );
      const {
        _id,
        firstName,
        lastName,
        email,
        phoneNumber,
        permissionLevel,
        imagePath,
      } = customer;
      await this.resourceManager.update(
        RESOURCES_TYPES.BUSINESS,
        business._id,
        {
          ...business,
          customers: [...business.customers, _id],
        }
      );
      this.eventEmitter.emitEvent({
        event: "send-mail",
        data: {
          type: "password",
          email,
          password,
        },
      });
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
      this.handleEntityServiceError(err);
    }
  }

  async retriveCustomers(query = {}) {
    const fields = query.fields ? query.fields.replaceAll(",", " ") : undefined;
    const limit = query.limit ? parseInt(query.limit) : undefined;
    const skip = query.limit ? parseInt(query.skip) : undefined;
    const customers = await this.searchResources({
      ...query,
      fields,
      limit,
      skip,
    });
    return customers.map((customer) => {
      if (customer.password) {
        const { password, ...rest } = customer;
        return rest;
      }
      return customer;
    });
  }

  async getCustomerById(id, fields = "") {
    const customer = await this.searchResourceById(
      id,
      fields.replaceAll(",", " ")
    );
    if (customer.password) {
      const { password, ...rest } = customer;
      return rest;
    }

    return customer;
  }

  async deleteCustomer(id) {
    try {
      const customer = await this.resourceManager.findById(
        RESOURCES_TYPES.CUSTOMER,
        id
      );
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
      await this.resourceManager.delete(RESOURCES_TYPES.CUSTOMER, id);
    } catch (err) {
      this.handleEntityServiceError(err);
    }
  }

  async updateCustomer(id, data) {
    try {
      await checkContactInfoExists(
        this.resourceManager,
        data.email,
        data.phoneNumber,
        { resource: RESOURCES_TYPES.USER, resourceId: id }
      );
      const fields =
        "_id firstName lastName email phoneNumber imagePath permissionLevel";
      const updatedCustomer = await this.updateResource(id, data, fields);
      if (!updatedCustomer) {
        throw new HTTPError("No customer matching the given id", "fail", 404);
      }
      return updatedCustomer;
    } catch (err) {
      this.handleEntityServiceError(err);
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
      return this.resourceManager.update(
        RESOURCES_TYPES.CUSTOMER,
        id,
        data,
        "_id firstName lastName email phoneNumber imagePath permissionLevel"
      );
    } catch (err) {
      throw err;
    }
  }

  async updateCustomerImage(id, newImage) {
    const customer = await this.resourceManager.findById(
      RESOURCES_TYPES.CUSTOMER,
      id
    );
    if (!customer) {
      throw new HTTPError("No customer matching the given Id", "fail", 404);
    }
    await updateImage(customer);
    const updatedUser = await this.resourceManager.update(
      RESOURCES_TYPES.CUSTOMER,
      id,
      {
        imagePath: newImage,
      },
      "_id firstName lastName email phoneNumber imagePath permissionLevel"
    );
    return updatedUser;
  }
}

module.exports = CustomerService;
