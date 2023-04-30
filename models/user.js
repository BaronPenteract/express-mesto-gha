const validator = require('validator');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: ({ VALUE }) => `${VALUE} не является действительным адресом электронной почты`,
    },
  },
  password: {
    type: String,
    required: [true, 'Поле обязательное'],
    select: false,
  },
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    required: true,
    minlength: [2, 'Слишком короткое значение'],
    maxlength: [30, 'Слишком длинное значение'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    required: true,
    minlength: [2, 'Слишком короткое значение'],
    maxlength: [30, 'Слишком длинное значение'],
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

module.exports = mongoose.model('user', userSchema);
