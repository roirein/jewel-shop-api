const { Model, default: mongoose } = require("mongoose");
const DBError = require("../errors/db-error");

class ResourceManager {
  #dbSchemas = {};

  /**
   *
   * @param {Record<String, Model>} dbSchemas
   */
  constructor(dbSchemas) {
    this.#dbSchemas = dbSchemas;
  }

  /**
   *
   * @param {string} resourceType
   * @returns {Model}
   */

  getResourceDB(resourceType) {
    return this.#dbSchemas[resourceType];
  }

  async createResource(resourceType, resourceContent) {
    try {
      const resourceDB = this.getResourceDB(resourceType);
      const newResource = await resourceDB.create(resourceContent);
      return newResource;
    } catch (err) {
      throw new DBError(err);
    }
  }

  async findOne(resourceType, query) {
    try {
      const resourceDB = this.getResourceDB(resourceType);
      const resource = await resourceDB.findOne(query);
      return resource;
    } catch (err) {
      throw err;
    }
  }

  async findAll(resourceType, query) {
    try {
      const resourceDB = this.getResourceDB(resourceType);
      const resources = await resourceDB.find().select(query.fields);
      return resources;
    } catch (err) {
      throw err;
    }
  }

  async findById(resourceType, id, fields = "") {
    try {
      const resourceDB = this.getResourceDB(resourceType);
      const resource = await resourceDB.findById(id).select(fields);
      return resource;
    } catch (err) {
      throw err;
    }
  }

  async delete(resourceType, id) {
    try {
      const resourceDB = this.getResourceDB(resourceType);
      const deletedResource = await resourceDB.findByIdAndDelete(id);
      return deletedResource;
    } catch (err) {
      throw err;
    }
  }

  async update(resourceType, id, data, fields = "") {
    try {
      const resourceDB = this.getResourceDB(resourceType);
      const updatedResource = await resourceDB
        .findByIdAndUpdate(id, data, { new: true })
        .select(fields);
      return updatedResource;
    } catch (err) {
      throw new DBError(err);
    }
  }

  #handleDBError(error) {
    const errorsObject = {};
    let result = {};
    if (error.name === "ValidationError") {
      Object.values(error.errors).forEach((value) => {
        errorsObject[value.properties.path] = value.properties.message;
      });
      result = {
        type: "DBError",
        subType: error.name,
        data: errorsObject,
      };
    }
  }
}

module.exports = ResourceManager;
