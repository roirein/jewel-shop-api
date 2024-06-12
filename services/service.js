const HTTPError = require("../errors/http-error");
const resourceManager = require("../resource-manager");

class Service {
  #resourceType;
  _resourceManager;

  /**
   *
   * @param {string} resourceType
   */
  constructor(resourceType) {
    this.#resourceType = resourceType;
    this._resourceManager = resourceManager;
  }

  get resourceType() {
    return this.#resourceType;
  }

  get resourceManager() {
    return this._resourceManager;
  }

  async _create(content) {
    const resource = await this.resourceManager.createResource(
      this.resourceType,
      content
    );
    return resource;
  }

  async getAll(query = {}) {
    try {
      const resources = await this.resourceManager.findAll(this.resourceType, {
        fields: query.fields ? query.fields.replaceAll(",", " ") : "",
      });
      return resources;
    } catch (err) {
      throw err;
    }
  }

  async getById(id, query = {}) {
    try {
      const resource = await this.resourceManager.findById(
        this.resourceType,
        id,
        query.fields ? query.fields.replaceAll(",", " ") : ""
      );
      if (!resource) {
        throw new HTTPError("The resource you are looking for does not exist");
      }
      return resource;
    } catch (err) {
      throw err;
    }
  }

  async _delete(id) {
    try {
      const deletedResource = await this.resourceManager.delete(
        this.resourceType,
        id
      );
      return !!deletedResource;
    } catch (err) {
      throw err;
    }
  }

  async _update(id, data, fields) {
    try {
      const updatedResource = await this.resourceManager.update(
        this.resourceType,
        id,
        data,
        fields
      );
      return updatedResource;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Service;
