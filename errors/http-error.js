class HTTPError extends Error {
  #status;
  #statusCode;

  constructor(message, status, statusCode) {
    super(message);
    this.#status = status;
    this.#statusCode = statusCode;
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
}

module.exports = HTTPError;
