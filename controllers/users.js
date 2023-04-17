const BadQueryError = require('../utils/BadQueryError');
const UnexistedDataError = require('../utils/UnexistedDataError');

const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnexistedDataError('Пользователь по указанному id не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadQueryError('Некоррекный id'));
      }

      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

module.exports.patchUser = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  if (!name && !about) {
    next(new BadQueryError('Все поля длжны быть заполнены'));
  } else {
    User.findByIdAndUpdate(
      _id,
      { name, about },
      {
        new: true,
        runValidators: true,
        upsert: false,
      },
    )
      .then((user) => {
        if (!user) {
          return Promise.reject(new UnexistedDataError('Пользователь по указанному id не найден'));
        }
        return res.send(user);
      })
      .catch((err) => next(err));
  }
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  if (!avatar) {
    next(new BadQueryError('Все поля длжны быть заполнены'));
  } else {
    User.findByIdAndUpdate(
      _id,
      { avatar },
      {
        new: true,
        runValidators: true,
        upsert: false,
      },
    )
      .then((user) => {
        if (!user) {
          return Promise.reject(new UnexistedDataError('Пользователь по указанному id не найден'));
        }
        return res.send(user);
      })
      .catch((err) => next(err));
  }
};
