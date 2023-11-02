const movies = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');

const {
  findUserMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');

movies.get('/', findUserMovies);

movies.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.string().required(),
      year: Joi.number().required(),
      description: Joi.string().required(),
      image: Joi.string().regex(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/).required(),
      trailer: Joi.string().regex(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/).required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      thumbnail: Joi.string().regex(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/).required(),
      movieId: Joi.number().required(),
    }),
  }),
  createMovie,
);

movies.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteMovieById,
);

movies.use(errors());

module.exports = movies;
