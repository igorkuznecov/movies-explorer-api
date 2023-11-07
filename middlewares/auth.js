const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const UnauthorizedError = require('../errors/unauthorized-err');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new UnauthorizedError('Необходима авторизация1'));
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (error) {
    return next(new UnauthorizedError('Необходима авторизация2'));
  }

  req.user = payload;

  next();
};
