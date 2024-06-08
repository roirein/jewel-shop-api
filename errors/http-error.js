class HTTPError extends Error {
  #status;
  #statusCode;
  #data;

  constructor(message, status, statusCode, data = {}) {
    super(message);
    this.#status = status;
    this.#statusCode = statusCode;
    this.#data = data;
  }

  get message() {
    return this.message;
  }

  get status() {
    return this.#status;
  }

  get statusCode() {
    return this.#statusCode;
  }

  get data() {
    return this.#data;
  }
}

module.exports = HTTPError;
