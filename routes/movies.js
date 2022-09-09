const express = require('express');
const router = express.Router();
const passport = require('passport');
const Models = require('../models');

//refer to the model names I defined in the “models.js” file
const Movies = Models.Movie;

// READ the list of all movies (GET)
router.get('/', passport.authenticate('jwt', { session: false}), function (req, res) {
  Movies.find()
    .then(function (movies) {
      res.status(201).json(movies);
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// READ the movie by title (GET)
router.get('/:Title', passport.authenticate('jwt', { session: false}), (req, res) => {
  Movies.findOne({ 'Title': req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

// READ the Genre by Name (GET)
router.get('/genres/:genreName', passport.authenticate('jwt', { session: false}), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.genreName})
    .then((movie) => {
      res.json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

// READ the Director by name (GET)
router.get('/directors/:directorName', passport.authenticate('jwt', { session: false}), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.directorName})
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

module.exports = router;