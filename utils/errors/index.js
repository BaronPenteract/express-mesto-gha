const BadRequestError = require('./BadRequestError');
const UnauthorizedError = require('./UnauthorizedError');
const ForbiddenError = require('./ForbiddenError');
const NotFoundError = require('./NotFoundError');
const InternalServerError = require('./InternalServerError');

module.exports = {
  BadRequestError, UnauthorizedError, NotFoundError, ForbiddenError, InternalServerError,
};
