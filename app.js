const express = require('express');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(helmet());

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
