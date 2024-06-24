const Service = require("../service");

class NotificationService extends Service {
  #io;
  #users;
  constructor(io) {
    super();
    this.#io = io;
    this.#users = {};
  }

  get io() {
    return this.#io;
  }

  get users() {
    return this.#users;
  }

  set users(updatedUsers) {
    this.#users = updatedUsers;
  }

  listen() {
    this.io.on("connection", (socket) => {
      this.eventEmitter.onEvent(
        "notification",
        this.handleNotification.bind(this, socket)
      );

      socket.on("login", (data) => {
        const loggedInUsers = {
          ...this.users,
          [data.id]: socket.id,
        };
        this.users = loggedInUsers;
      });
    });
  }

  handleNotification(socket, data) {
    socket.emit(data.type, data.content);
  }
}

module.exports = NotificationService;
