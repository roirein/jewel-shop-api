const { Model } = require("mongoose");

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
      throw err;
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
}

module.exports = ResourceManager;
