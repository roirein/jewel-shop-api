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
      return newResource._doc;
    } catch (err) {
      throw new DBError(err);
    }
  }

  async findOne(resourceType, query) {
    try {
      const resourceDB = this.getResourceDB(resourceType);
      const resource = await resourceDB.findOne(query);
      return resource ? resource._doc : null;
    } catch (err) {
      throw err;
    }
  }

  async findAll(resourceType, query) {
    try {
      const resourceDB = this.getResourceDB(resourceType);
      const { skip, limit, fields, ...rest } = query;
      const filters = {};
      Object.entries(rest).forEach(([key, value]) => {
        if (value === "null") {
          filters[key] = null;
        } else {
          filters[key] = value;
        }
      });
      let resourcesPromise = resourceDB.find(filters);
      if (fields) {
        resourcesPromise = resourcesPromise.select(fields);
      }
      if (skip) {
        resourcesPromise = resourcesPromise.skip(skip);
      }
      if (limit) {
        resourcesPromise = resourcesPromise.limit(limit);
      }
      const resources = await resourcesPromise;
      return resources.map((resource) => resource._doc);
    } catch (err) {
      throw err;
    }
  }

  async findById(resourceType, id, fields = "") {
    try {
      const resourceDB = this.getResourceDB(resourceType);
      const resource = await resourceDB.findById(id).select(fields);
      return resource ? resource._doc : null;
    } catch (err) {
      throw err;
    }
  }

  async delete(resourceType, id) {
    try {
      const resourceDB = this.getResourceDB(resourceType);
      const deletedResource = await resourceDB.findByIdAndDelete(id);
      if (!deletedResource) {
        return false;
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  async update(resourceType, id, data, fields = "") {
    try {
      const resourceDB = this.getResourceDB(resourceType);
      const updatedResource = await resourceDB.findByIdAndUpdate(id, data, {
        new: true,
        select: fields,
      });
      return updatedResource ? updatedResource._doc : null;
    } catch (err) {
      throw new DBError(err);
    }
  }
}

module.exports = ResourceManager;
