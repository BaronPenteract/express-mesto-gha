// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле обязательное'],
    minlength: [2, 'Слишком короткое значение'],
    maxlength: [30, 'Слишком длинное значение'],
  },
  about: {
    type: String,
    required: [true, 'Поле обязательное'],
    minlength: [2, 'Слишком короткое значение'],
    maxlength: [30, 'Слишком длинное значение'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле обязательное'],
  },
});

module.exports = mongoose.model('user', userSchema);
