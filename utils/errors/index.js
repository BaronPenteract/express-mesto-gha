const BadQueryError = require('./BadQueryError');
const BadLoginDataError = require('./BadLoginDataError');
const ForbiddenError = require('./ForbiddenError');
const UnexistedDataError = require('./UnexistedDataError');

module.exports = {
  BadQueryError, BadLoginDataError, UnexistedDataError, ForbiddenError,
};
