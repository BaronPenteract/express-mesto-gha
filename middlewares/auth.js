const { checkToken } = require('../utils/token');
const { BadLoginDataError } = require('../utils/errors');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new BadLoginDataError('Доступ запрещен.');
  }
  const token = authorization.replace('Bearer ', '');

  const payload = checkToken(token);

  if (!payload) {
    throw new BadLoginDataError('Доступ запрещен.');
  }

  req.user = payload;

  next();
};

module.exports = auth;
