const bcrypt = require('bcryptjs');

const { BadQueryError, BadLoginDataError, UnexistedDataError } = require('../utils/errors');
const { generateToken } = require('../utils/token');

const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.json(users))
    .catch((err) => {
      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  let userId;

  if (req.path === '/me') {
    userId = req.user._id;
  } else {
    userId = req.params.userId;
  }

  /* const { userId } = req.params; */

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnexistedDataError('Пользователь по указанному id не найден.'));
      }
      return res.json(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadQueryError('Некоррекный id.'));
      }

      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  /*
  if (!validator.isEmail(email) || !password) {
    throw new BadQueryError('Некоррекный e-mail или пароль.');
  } */

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((newUser) => res.json(newUser)))
    .catch((err) => next(err));
};

module.exports.patchUser = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;

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
        return Promise.reject(new UnexistedDataError('Пользователь по указанному id не найден.'));
      }
      return res.json(user);
    })
    .catch((err) => next(err));
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  if (!avatar) {
    next(new BadQueryError('Все поля длжны быть заполнены.'));
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
          return Promise.reject(new UnexistedDataError('Пользователь по указанному id не найден.'));
        }
        return res.json(user);
      })
      .catch((err) => next(err));
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  /* if (!email || !password) {
    throw new BadQueryError('Поля обязательны для заполнения.');
  } */

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new BadLoginDataError('Неправильные почта или пароль.');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new BadLoginDataError('Неправильные почта или пароль.');
          }

          const token = generateToken(
            { _id: user._id, email: user.email },
            { expiresIn: '7d' },
          );

          res.json({ token });
        });
    })
    .catch(next);
};
