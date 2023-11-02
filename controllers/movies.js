const Movie = require('../models/movies');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const BadRequestError = require('../errors/bad-request-err');

module.exports.findUserMovies = (req, res, next) => {
  Movie.find({ owner: req.user })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с таким ID не найден');
      }
      if (movie.owner && !movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Это не ваш фильм');
      }

      return Movie.deleteOne(movie).then(() => Movie.find({ owner: req.user }).then((movies) => res.send(movies)));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Неверный ID фильма'));
      }
      return next(err);
    });
};
