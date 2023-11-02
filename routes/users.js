const users = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const { me, updateUserInfo } = require('../controllers/users');

users.get('/me', me);

users.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
    }),
  }),
  updateUserInfo,
);

users.use(errors());
module.exports = users;
