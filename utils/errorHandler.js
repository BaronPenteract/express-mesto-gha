const { ERROR_CODE_NOT_FOUND, ERROR_CODE_BAD_REQUEST, ERROR_CODE_INTERNAL_SERVER } = require('./constants');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError' || err.name === 'BadQueryError') {
    res.status(ERROR_CODE_BAD_REQUEST).send({ message: err.message });
    return;
  }

  if (err.name === 'UnexistedDataError') {
    res.status(ERROR_CODE_NOT_FOUND).send({ message: err.message });
    return;
  }
  res.status(ERROR_CODE_INTERNAL_SERVER).send({ message: err.message, err });
};

module.exports = errorHandler;
