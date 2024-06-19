const Service = require("../service");

class NotificationService extends Service {
  #socket;
  static #users = {};
  constructor(io) {
    super();
    io.on("connection", (socket) => {
      this.#socket = socket;
    });
    this.eventEmitter.onEvent(
      "notification",
      this.handleNotification.bind(this)
    );
  }

  get socket() {
    return this.#socket;
  }

  handleNotification(data) {
    this.socket.emit(data.type, data.content);
  }
}

module.exports = NotificationService;
