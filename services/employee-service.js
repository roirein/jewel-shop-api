const HTTPError = require("../errors/http-error");
const RESOURCES_TYPES = require("../resource-manager/definitions");
const { isUserExists, generatePassword } = require("../routes/utils/user");
const Service = require("./service");

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
}

module.exports = EmployeeService;
