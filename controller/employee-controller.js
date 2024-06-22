const HTTPError = require("../errors/http-error");
const EmployeeService = require("../services/rest-services/entity-services/employee-service");
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
      console.log(req.body);
      if (!req.file) {
        throw new HTTPError("Image is required", "fail", 400);
      }
      const employee = await this.service.createEmployee({
        ...req.body,
        imagePath: req.file.filename,
      });
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

  async getAllEmployees(req, res, next) {
    try {
      const employees = await this.service.retriveEmployees(req.query);
      res.status(200).json({
        status: "success",
        data: {
          employees,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async getEmployeeById(req, res, next) {
    try {
      const employee = await this.service.getEmployeeById(
        req.params.employeeId,
        req?.query?.fields
      );
      res.status(200).json({
        status: "success",
        data: {
          employee,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteEmployee(req, res, next) {
    try {
      await this.service.deleteEmployee(req.params.employeeId);
      res.status(204).json({
        status: "success",
        message: "employee deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  async updateEmployee(req, res, next) {
    try {
      const updatedEmployee = await this.service.updateEmployee(
        req.params.employeeId,
        req.body
      );
      res.status(200).json({
        status: "success",
        data: {
          employee: updatedEmployee,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async updateEmployeeRole(req, res, next) {
    try {
      const updatedEmployee = await this.service.updateEmployeeRole(
        req.params.employeeId,
        req.body
      );
      res.status(200).json({
        status: "success",
        data: {
          employee: updatedEmployee,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async updateEmployeeImage(req, res, next) {
    try {
      const updatedEmployee = await this.service.updateEmployeeImage(
        req.params.employeeId,
        req.file.filename
      );
      res.status(200).json({
        status: "success",
        data: {
          employee: updatedEmployee,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = EmployeeController;
