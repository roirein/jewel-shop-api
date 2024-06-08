const CustomerService = require("../services/customer-service");
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
      const customer = await this.service.createCustomer(req.body);
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
}

module.exports = CustomerController;
