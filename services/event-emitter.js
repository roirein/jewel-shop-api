const EventEmitter = require("node:events");

class ServiceEventEmitter {
  #emitter;
  constructor() {
    const emitter = new EventEmitter();
    emitter.setMaxListeners(100);
    this.#emitter = emitter;
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
