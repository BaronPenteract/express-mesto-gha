class UnexistedDataError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnexistedDataError';
  }
}

module.exports = UnexistedDataError;
