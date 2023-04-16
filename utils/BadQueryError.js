class BadQueryError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadQueryError';
  }
}

module.exports = BadQueryError;
