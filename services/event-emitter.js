const EventEmitter = require("node:events");

class ServiceEventEmitter {
  #emitter;
  constructor() {
    this.#emitter = new EventEmitter();
  }

  get emitter() {
    return this.#emitter;
  }

  emitEvent(data) {
    this.emitter.emit(data.event, data.data);
  }

  onEvent(event, listener) {
    this.emitter.on(event, listener);
  }
}

module.exports = new ServiceEventEmitter();
