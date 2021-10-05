class BadRequest extends Error {
  constructor(message, statusCode) {
    super(message);
    this.type = 'Bad Request';
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = BadRequest;
