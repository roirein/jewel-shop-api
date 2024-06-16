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
}

module.exports = RegistrationRequestController;
