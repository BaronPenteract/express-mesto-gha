/* eslint-disable no-unused-vars */
const { ERROR_CODE_INTERNAL_SERVER, ERROR_CODE_BAD_REQUEST } = require('./constants');

const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'BadQueryError' || err.name === 'CastError') {
    res.status(ERROR_CODE_BAD_REQUEST).send({ message: err.message });
    return;
  }
  res.status(ERROR_CODE_INTERNAL_SERVER).send({ message: err.message, err });
};

module.exports = errorHandler;
