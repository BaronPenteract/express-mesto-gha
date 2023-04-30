const router = require('express').Router();
const {
  celebrate, Joi, Segments,
} = require('celebrate');

const {
  getUsers,
  getUserById,
  patchUser,
  patchAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserById);
router.get('/:userId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);
router.patch('/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), patchUser);
router.patch('/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().regex(/^https?:\/\/[a-zA-Z\d]+[-a-zA-Z\d.]*\.[a-zA-Z]{2,}(\/[-a-zA-Z@:%._+~#=&?\d]+)*\/*/i).required(),
  }),
}), patchAvatar);

module.exports = router;
