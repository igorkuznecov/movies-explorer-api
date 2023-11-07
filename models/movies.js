const mongoose = require('mongoose');
const validator = require('validator');

const movieModel = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(image) {
        validator.isURL(image);
      },
      message: 'Некорректная ссылка',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(trailer) {
        validator.isURL(trailer);
      },
      message: 'Некорректная ссылка',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(thumbnail) {
        validator.isURL(thumbnail);
      },
      message: 'Некорректная ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieModel);
