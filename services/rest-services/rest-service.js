const resourceManager = require("../../resource-manager");

class RestService extends Service {
  #resourceManager;
  constructor() {
    super();
    this.#resourceManager = resourceManager;
  }

  get resourceManager() {
    return this.#resourceManager;
  }
}

module.exports = RestService;
