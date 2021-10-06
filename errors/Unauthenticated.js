class Unauthenticated extends Error {
  constructor(message, statusCode) {
    super(message);
    this.type = 'Unauthenticated';
    this.statusCode = statusCode;
  }
}

module.exports = Unauthenticated;
