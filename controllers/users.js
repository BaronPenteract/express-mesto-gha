const { ERROR_CODE_BAD_REQUEST, ERROR_CODE_INTERNAL_SERVER, ERROR_CODE_NOT_FOUND } = require('../utils/constants');

const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res.status(ERROR_CODE_INTERNAL_SERVER).send({ message: 'Произошла ошибка' });
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Некорректный id' });
        return;
      }

      res.status(ERROR_CODE_INTERNAL_SERVER).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: err.message });
        return;
      }

      res.status(ERROR_CODE_INTERNAL_SERVER).send({ message: err.message });
    });
};

module.exports.patchUser = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  if (!name && !about) {
    res.status(ERROR_CODE_BAD_REQUEST).send({
      message: 'Тело запроса должно содержать объект типа: { name: String, about: String }',
    });
    return;
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
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: err.message });
        return;
      }

      if (err.name === 'CastError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Некорректный id' });
        return;
      }

      res.status(ERROR_CODE_INTERNAL_SERVER).send({ message: err.message });
    });
};

module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  if (!avatar) {
    res.status(ERROR_CODE_BAD_REQUEST).send({
      message: 'Тело запроса должно содержать объект типа: { avatar: URL }',
    });
    return;
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
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: err.message });
        return;
      }

      if (err.name === 'CastError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Некорректный id' });
        return;
      }

      res.status(ERROR_CODE_INTERNAL_SERVER).send({ message: err.message });
    });
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