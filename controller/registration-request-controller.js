const RegistrationRequestService = require("../services/entity-services/registration-request-service");
const Controller = require("./controller");

class RegistrationRequestController extends Controller {
  /**
   *
   * @param {RegistrationRequestService} service
   */
  constructor(service) {
    super(service);
  }

  async createRequest(req, res, next) {
    try {
      const request = await this.service.createRequest(req.body);
      res.status(201).json({
        status: "success",
        data: {
          request,
        },
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async getAllRequests(req, res, next) {
    try {
      const requests = await this.service.retriveRequests(req.query);
      res.status(200).json({
        status: "success",
        data: {
          requests,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async getRequestById(req, res, next) {
    try {
      const request = await this.service.getRequestById(
        req.params.requestId,
        req?.query?.fields
      );
      res.status(200).json({
        status: "success",
        data: {
          request,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async respondRequest(req, res, next) {
    try {
      const request = await this.service.respondRequest(
        req.params.requestId,
        req.body
      );
      res.status(200).json({
        status: "success",
        data: {
          request,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteRequest(req, res, next) {
    try {
      await this.service.deleteRequest(req.params.requestId);
      res.status(204).json({
        status: "success",
        message: "request deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = RegistrationRequestController;
