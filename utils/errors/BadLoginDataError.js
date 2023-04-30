class BadLoginDataError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadLoginDataError';
  }
}

module.exports = BadLoginDataError;
