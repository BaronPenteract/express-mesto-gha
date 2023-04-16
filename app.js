const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const errorHandler = require('./utils/errorHandler');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '643a3ac268e0df9232ade602', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/cards', routerCards);
app.use('/users', routerUsers);

app.use((req, res) => {
  res.status(404).send({ message: 'Некорректный запрос' });
});

app.use(errorHandler);

app.listen(PORT);
