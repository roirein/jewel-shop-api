const serviceEventEmitter = require("./event-emitter");

/**
 * This is type definition for service
 */
class Service {
  #eventEmitter;

  constructor() {
    this.#eventEmitter = serviceEventEmitter;
  }

  get eventEmitter() {
    return this.#eventEmitter;
  }
}

module.exports = Service;
