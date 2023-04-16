const { ERROR_CODE_BAD_REQUEST, ERROR_CODE_INTERNAL_SERVER, ERROR_CODE_NOT_FOUND } = require('../utils/constants');

const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { user } = req;

  Card.create({ name, link, owner: user._id })
    .then((card) => card.populate('owner'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: err.message });
        return;
      }

      res.status(ERROR_CODE_INTERNAL_SERVER).send({ message: err.message });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner likes')
    .then((cards) => res.send(cards))
    .catch((err) => res.status(ERROR_CODE_INTERNAL_SERVER).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  const { user } = req;

  Card.findById(cardId)
    .populate('owner likes')
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка с таким id не найдена' });
        return;
      }

      if (card.owner._id.toString() !== user._id.toString()) {
        res.status(ERROR_CODE_BAD_REQUEST).send({
          message: 'Вы не являетесь владельцем этой карточки!',
        });
        return;
      }

      card.deleteOne();
      res.send({ message: `Card: ${cardId} is no more! (Удалена успешно)` });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Некорректный id' });
        return;
      }
      res.status(ERROR_CODE_INTERNAL_SERVER).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  const { user } = req;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: user._id } }, { new: true })
    .populate('owner likes')
    .then((card) => res.send(card.likes))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Некорректный id' });
        return;
      }

      if (Object.keys(err).length === 0) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка с таким id не найдена' });
        return;
      }

      res.status(ERROR_CODE_INTERNAL_SERVER).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.disLikeCard = (req, res) => {
  const { cardId } = req.params;
  const { user } = req;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: user._id } }, { new: true })
    .populate('owner likes')
    .then((card) => res.send(card.likes))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Некорректный id' });
        return;
      }

      if (Object.keys(err).length === 0) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка с таким id не найдена' });
        return;
      }

      res.status(ERROR_CODE_INTERNAL_SERVER).send({ message: 'Что-то пошло не так' });
    });
};
