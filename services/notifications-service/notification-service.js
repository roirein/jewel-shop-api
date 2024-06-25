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
        this.handleNotification.bind(this)
      );

      socket.on("login", (data) => {
        const loggedInUsers = {
          ...this.users,
          [data.id]: socket.id,
        };
        this.users = loggedInUsers;
      });

      socket.on("disconnect", () => {
        const updatedUsers = Object.fromEntries(
          Object.entries(this.users).filter(([key, value]) => {
            return value !== socket.id;
          })
        );
        this.users = updatedUsers;
      });
    });
  }

  handleNotification(data) {
    const userSocket = this.users[data.userId];
    if (userSocket) {
      this.io.to(userSocket).emit(data.type, data.content);
    }
  }
}

module.exports = NotificationService;
