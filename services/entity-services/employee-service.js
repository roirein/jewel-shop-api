const HTTPError = require("../../errors/http-error");
const RESOURCES_TYPES = require("../../resource-manager/definitions");
const { generatePassword, updateImage } = require("../utils/user");
const { ROLES } = require("../../consts/employees");
const { checkContactInfoExists } = require("../utils/contact-info");
const BaseEntityService = require("./base-entity-service");

class EmployeeService extends BaseEntityService {
  constructor() {
    super(RESOURCES_TYPES.EMPLOYEE);
  }

  async createEmployee(data) {
    await checkContactInfoExists(
      this.resourceManager,
      data.email,
      data.phoneNumber
    );
    const userData = { ...data, password: generatePassword() };
    const employee = await this.createResource(userData);
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
  }

  async retriveEmployees(query = {}) {
    const fields = query.fields ? query.fields.replaceAll(",", " ") : undefined;
    const limit = query.limit ? parseInt(query.limit) : undefined;
    const skip = query.limit ? parseInt(query.skip) : undefined;
    const employees = await this.searchResources({
      ...query,
      fields,
      limit,
      skip,
    });
    return employees.map((employee) => {
      if (employee.password) {
        const { password, ...rest } = employee;
        return rest;
      }
      return employee;
    });
  }

  async getEmployeeById(id, fields = "") {
    const employee = await this.searchResourceById(
      id,
      fields.replaceAll(",", " ")
    );
    if (employee.password) {
      const { password, ...rest } = employee;
      return rest;
    }

    return employee;
  }

  async updateEmployee(id, data) {
    await checkContactInfoExists(
      this.resourceManager,
      data.email,
      data.phoneNumber,
      { resource: RESOURCES_TYPES.USER, resourceId: id }
    );
    const fields = "_id firstName lastName email phoneNumber role imagePath";
    const updatedEmployee = await this.updateResource(id, data, fields);
    return updatedEmployee;
  }

  async updateEmployeeRole(id, data) {
    if (!Object.values(ROLES).includes(data.role)) {
      throw new HTTPError("Role must be a valid role in the shop", "fail", 400);
    }
    const updatedEmployee = await this.resourceManager.update(
      RESOURCES_TYPES.EMPLOYEE,
      id,
      data,
      "_id firstName lastName email phoneNumber role imagePath"
    );
    if (!updatedEmployee) {
      throw new HTTPError("No employee matching the given id", "fail", 404);
    }
    return updatedEmployee;
  }

  async updateEmployeeImage(id, newImage) {
    const employee = await this.resourceManager.findById(
      RESOURCES_TYPES.EMPLOYEE,
      id
    );
    if (!employee) {
      throw new HTTPError("No employee matching the given Id", "fail", 404);
    }
    await updateImage(employee);
    const updatedEmployee = await this.resourceManager.update(
      RESOURCES_TYPES.EMPLOYEE,
      id,
      {
        imagePath: newImage,
      },
      "_id firstName lastName email phoneNumber role imagePath"
    );
    return updatedEmployee;
  }

  async deleteEmployee(id) {
    await this.deleteResource(id);
  }
}

module.exports = EmployeeService;
