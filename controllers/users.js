const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-err");
const ConflictError = require("../errors/conflict-err");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.me = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        return res.send({
          name: user.name,
          email: user.email,
          _id: user._id,
        });
      }
      throw new NotFoundError("Пользователя с таким ID не существует");
    })
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        email,
        password: hash,
      })
    )
    .then((user) =>
      res.send({
        name: user.name,
        email: user.email,
        _id: user._id,
      })
    )
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new ConflictError("Пользователь с такой почтой уже зарегистрирован")
        );
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Переданы некорректные данные"));
      }
      return next(err);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true }
  )
    .then((user) =>
      res.send({
        name: user.name,
        email: user.email,
      })
    )
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new ConflictError(
            "Этот почтовый адрес используется другим пользователем"
          )
        );
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Переданы некорректные данные"));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign(
          { _id: user._id },
          NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
          {
            expiresIn: "7d",
          }
        ),
      });
    })
    .catch((err) => next(err));
};
