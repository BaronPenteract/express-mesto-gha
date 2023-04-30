const {
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_FORBIDDEN,
  ERROR_CODE_BAD_REQUEST,
  ERROR_CODE_INTERNAL_SERVER,
  ERROR_CODE_UNAUTHORIZED,
  ERROR_CODE_CONFLICT,
} = require('./constants');

const {
  BadQueryError,
  BadLoginDataError,
  UnexistedDataError,
  ForbiddenError,
} = require('./errors');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Некорректные данные.' });
    return;
  }

  if (err instanceof BadQueryError) {
    res.status(ERROR_CODE_BAD_REQUEST).send({ message: err.message });
    return;
  }

  if (err instanceof BadLoginDataError) {
    res.status(ERROR_CODE_UNAUTHORIZED).send({ message: err.message });
    return;
  }

  if (err instanceof ForbiddenError) {
    res.status(ERROR_CODE_FORBIDDEN).send({ message: err.message });
    return;
  }

  if (err instanceof UnexistedDataError) {
    res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запрашиваемая информация отсутствует.' });
    return;
  }

  if (err.code === 11000) {
    res.status(ERROR_CODE_CONFLICT).send({ message: 'Пользователь с таким e-mail уже существует.' });
    return;
  }

  res.status(ERROR_CODE_INTERNAL_SERVER).send({ message: 'Что-то пошло не так.' });
};

module.exports = errorHandler;
