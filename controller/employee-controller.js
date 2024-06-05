const EmployeeService = require("../services/employee-service");
const Controller = require("./controller");

class EmployeeController extends Controller {
  /**
   *
   * @param {EmployeeService} service
   */
  constructor(service) {
    super(service);
  }

  async createEmployee(req, res, next) {
    try {
      const employee = await this.service.createEmployee(req.body);
      res.status(201).json({
        status: "success",
        data: {
          employee,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = EmployeeController;
