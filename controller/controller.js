class Controller {
  #service;
  constructor(service) {
    this.#service = service;
  }

  get service() {
    return this.#service;
  }
}

module.exports = Controller;
