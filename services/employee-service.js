const HTTPError = require("../errors/http-error");
const RESOURCES_TYPES = require("../resource-manager/definitions");
const { isUserExists, generatePassword } = require("./utils/user");
const Service = require("./service");
const { ROLES } = require("../consts/employees");

class EmployeeService extends Service {
  constructor() {
    super(RESOURCES_TYPES.EMPLOYEE);
  }

  async createEmployee(data) {
    try {
      if (await isUserExists(this.resourceManager, data)) {
        throw new HTTPError(
          "Your email or phone number already exists in the system",
          "fail",
          409
        );
      }
      const userData = { ...data, password: generatePassword() };
      const employee = await this._create(userData);
      const { firstName, lastName, email, phoneNumber, role, imagePath } =
        employee;
      return {
        firstName,
        lastName,
        email,
        phoneNumber,
        imagePath,
        role,
      };
    } catch (err) {
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
      const query = {
        _id: { $ne: id },
        $or: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
      };
      if (!!(await this.resourceManager.findOne(this.resourceType, query))) {
        throw new HTTPError(
          "Your email or phone number already exists in the system",
          "fail",
          409
        );
      }
      const fields = "_id firstName lastName email phoneNumber role";
      const updatedUser = await this._update(id, data, fields);
      if (!updatedUser) {
        throw new HTTPError("No employee matching the given id", "fail", 404);
      }
      return updatedUser;
    } catch (err) {
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
}

module.exports = EmployeeService;
