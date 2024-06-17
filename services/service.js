const ServiceEventEmitter = require("./event-emitter");

/**
 * This is type definition for service
 */
class Service {
  #eventEmitter;

  constructor() {
    this.#eventEmitter = new ServiceEventEmitter();
  }

  get eventEmitter() {
    return this.#eventEmitter;
  }
}

module.exports = Service;
