const HTTPError = require("../errors/http-error");
const CustomerService = require("../services/entity-services/customer-service");
const Controller = require("./controller");

class CustomerController extends Controller {
  /**
   *
   * @param {CustomerService} service
   */
  constructor(service) {
    super(service);
  }

  async createCustomer(req, res, next) {
    try {
      const customer = await this.service.createCustomer(
        req.body,
        req.params.businessId
      );
      res.status(201).json({
        status: "success",
        data: {
          customer,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllCustomers(req, res, next) {
    try {
      const customers = await this.service.retriveCustomers(req.query);
      res.status(200).json({
        status: "success",
        data: {
          customers,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async getCustomerById(req, res, next) {
    try {
      const customer = await this.service.getCustomerById(
        req.params.customerId,
        req?.query?.fields
      );
      res.status(200).json({
        status: "success",
        data: {
          customer,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteCustomer(req, res, next) {
    try {
      await this.service.deleteCustomer(req.params.customerId);
      res.status(204).json({
        status: "success",
        message: "customer deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  async updateCustomer(req, res, next) {
    try {
      const updatedCustomer = await this.service.updateCustomer(
        req.params.customerId,
        req.body
      );
      res.status(200).json({
        status: "success",
        data: {
          customer: updatedCustomer,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async updateCustomerPermission(req, res, next) {
    try {
      const updatedCustomer = await this.service.updateCustomerPermission(
        req.params.customerId,
        req.body
      );
      res.status(200).json({
        status: "success",
        data: {
          customer: updatedCustomer,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async updateCustomerImage(req, res, next) {
    try {
      if (!req.file) {
        throw new HTTPError("Image is required", "fail", 400);
      }
      const updatedCustomer = await this.service.updateCustomerImage(
        req.params.customerId,
        req.file.filename
      );
      res.status(200).json({
        status: "success",
        data: {
          customer: updatedCustomer,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CustomerController;
