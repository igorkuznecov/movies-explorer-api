require('dotenv').config();
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const cors = require('cors');
const express = require('express');

const app = express();
const { celebrate, Joi, errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const authChecker = require('./middlewares/auth');
const errorHandler = require('./middlewares/error');
const NotFoundError = require('./errors/not-found-err');

const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose
  .connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
    useNewUrlParser: true,
    autoIndex: true,
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(requestLogger);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email({ tlds: { allow: false } }).required(),
      password: Joi.string().min(2).max(30).required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().alphanum().min(2).max(30),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

app.use(authChecker);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
