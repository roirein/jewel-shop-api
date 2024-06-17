const BusinessService = require("../services/rest-services/entity-services/business-service");
const Controller = require("./controller");

class BusinessController extends Controller {
  /**
   *
   * @param {BusinessService} service
   */
  constructor(service) {
    super(service);
  }

  async createBusiness(req, res, next) {
    try {
      const business = await this.service.createBusiness(req.body);
      res.status(200).json({
        status: "success",
        data: {
          business,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllBusiness(req, res, next) {
    try {
      const businesses = await this.service.retrieveBusinesses(req.query);
      res.status(200).json({
        status: "success",
        data: {
          businesses,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async getBusinessById(req, res, next) {
    try {
      const business = await this.service.getBusinessById(
        req.params.businessId,
        req?.query?.fields
      );
      res.status(200).json({
        status: "success",
        data: {
          business,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteBusiness(req, res, next) {
    try {
      await this.service.deleteBusiness(req.params.businessId);
      res.status(204).json({
        status: "success",
        message: "business deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  async updateBusiness(req, res, next) {
    try {
      const updatedBusiness = await this.service.updateBusiness(
        req.params.businessId,
        req.body
      );
      res.status(200).json({
        status: "success",
        data: {
          business: updatedBusiness,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = BusinessController;
