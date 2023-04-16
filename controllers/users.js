const BadQueryError = require('../utils/BadQueryError');

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
        return Promise.reject(new BadQueryError('Пользователь по указанному id не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadQueryError('Некоррекный id'));
      }

      next(err);
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
    return next(new BadQueryError('Все поля длжны быть заполнены'));
  }

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
        return Promise.reject(new BadQueryError('Пользователь по указанному id не найден'));
      }
      return res.send(user);
    })
    .catch((err) => next(err));
  return undefined;
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  if (!avatar) {
    return next(new BadQueryError('Все поля длжны быть заполнены'));
  }

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
        return Promise.reject(new BadQueryError('Пользователь по указанному id не найден'));
      }
      return res.send(user);
    })
    .catch((err) => next(err));
  return undefined;
};

/* module.exports.patchUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  const { _id } = req.user;

  const user = await User.findById(_id).catch((err) => {
    return err;
  });

  if (user instanceof Error) {
    if (user.name === 'CastError') {
      res.status(400).send({ message: 'Некорректный id' });
      return;
    }

    res.status(ERROR_CODE_INTERNAL_SERVER).send({ message: user.message });
    return;
  }

  const update = {
    name: name || user.name,
    about: about || user.about,
    avatar: avatar || user.avatar,
  };

  try {
    await user.updateOne(update, {
      new: true,
      runValidators: true,
      upsert: true,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: err.message });
      return;
    }

    res.status(ERROR_CODE_INTERNAL_SERVER).send({ message: err.message });
  }

  const updatedUser = await User.findById(_id);
  res.send(updatedUser);
}; */
