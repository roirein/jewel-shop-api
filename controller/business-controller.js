const BusinessService = require("../services/business-service");
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
}

module.exports = BusinessController;
