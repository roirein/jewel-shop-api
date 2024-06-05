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
    try {
      const resource = await this.resourceManager.createResource(
        this.resourceType,
        content
      );
      return resource;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Service;
