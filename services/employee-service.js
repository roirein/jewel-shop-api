const fs = require("fs").promises;
const HTTPError = require("../errors/http-error");
const RESOURCES_TYPES = require("../resource-manager/definitions");
const {
  generatePassword,
  checkUserExists,
  checkUniqneUpdateData,
} = require("./utils/user");
const Service = require("./service");
const { ROLES } = require("../consts/employees");
const path = require("path");

class EmployeeService extends Service {
  constructor() {
    super(RESOURCES_TYPES.EMPLOYEE);
  }

  async createEmployee(data) {
    try {
      await checkUserExists(this.resourceManager, data);
      const userData = { ...data, password: generatePassword() };
      const employee = await this._create(userData);
      const { _id, firstName, lastName, email, phoneNumber, role, imagePath } =
        employee;
      return {
        _id,
        firstName,
        lastName,
        email,
        phoneNumber,
        imagePath,
        role,
      };
    } catch (err) {
      if (err.type && err.type === "DBError") {
        throw err.toHTTPError();
      }
      throw err;
    }
  }

  async getAllEmployees(query = {}) {
    try {
      return await this._getAll(query);
    } catch (err) {
      throw err;
    }
  }

  async getEmployeeById(id, query = {}) {
    try {
      const employee = await this._getById(id, query);
      if (!employee) {
        throw new HTTPError("No employee matching the given id", "fail", 404);
      }
      return employee;
    } catch (err) {
      throw err;
    }
  }

  async deleteEmployee(id) {
    try {
      const isDeleteSuccessfull = await this._delete(id);
      if (!isDeleteSuccessfull) {
        throw new HTTPError("No employee matching the given id", "fail", 404);
      }
    } catch (err) {
      throw err;
    }
  }

  async updateEmployee(id, data) {
    try {
      await checkUniqneUpdateData(this.resourceManager, id, data);
      const fields = "_id firstName lastName email phoneNumber role imagePath";
      const updatedUser = await this._update(id, data, fields);
      if (!updatedUser) {
        throw new HTTPError("No employee matching the given id", "fail", 404);
      }
      return updatedUser;
    } catch (err) {
      if (err.type && err.type === "DBError") {
        throw err.toHTTPError();
      }
      throw err;
    }
  }

  async updateEmployeeRole(id, data) {
    try {
      if (!Object.values(ROLES).includes(data.role)) {
        throw new HTTPError(
          "Role must be a valid role in the shop",
          "fail",
          400
        );
      }
      return this.updateEmployee(id, data);
    } catch (err) {
      throw err;
    }
  }

  async updateEmployeeImage(id, newImage) {
    try {
      const employee = await this._getById(id);
      if (!employee) {
        throw new HTTPError("No employee matching the given Id", "fail", 404);
      }
      const employeeImage = employee.imagePath;
      const fullImagePath = path.join(
        __dirname,
        "..",
        `images/users/${employeeImage}`
      );
      await fs.unlink(fullImagePath);
      const updatedUser = await this.updateEmployee(id, {
        imagePath: newImage,
      });
      return updatedUser;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = EmployeeService;
