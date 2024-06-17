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
    console.log(data);
    this.emitter.emit("mail-send", data);
  }
}

module.exports = ServiceEventEmitter;
