const express = require('express');
const router = express.Router();
const passport = require('passport');
const Models = require('../models');

const {check, validationResult } = require('express-validator');

//refer to the model names I defined in the “models.js” file
const Users = Models.User;

//Get all users (GET)
router.get('/', passport.authenticate('jwt', { session: false}), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username (GET)
router.get('/:Username', passport.authenticate('jwt', { session: false}), (req, res) => {
  Users.findOne({ Username: req.params.Username })//querying a specific user by their username, you need to pass, as a parameter, an object that contains the criteria 
    .then((user) => {//After the document is created, I then send a response back to the client with the user data (document) that was just read
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// CREATE a user (POST)
router.post('/',
[
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

  // check the validation object for errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists'); //If the user is found, send a response that it already exists
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
          //handles any errors
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    //handles any errors
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Update a user's info, by username (PUT)
router.put('/:Username',

  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],

 passport.authenticate('jwt', { session: false}), 
 (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  Users.findOneAndUpdate ({ Username: req.params.Username //avoid findOneAndUpdate???
}, { $set: // fields in the user document I'am updating
    { 
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.bodyBirthday
    }
  },
  {new: true },// This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) { //error handling
      console.error(err);
      res.status(500).send('Error' + err);
    } else { //updated user
      res.json(updatedUser);
    }
  });
});

// Add a movie to a user's list of favorites (POST)
router.post('/:Username/movies/:movieID', passport.authenticate('jwt', { session: false}), (req,res) => {
  Users.findOneAndUpdate ({ Username: req.params.Username}, //avoid findOneAndUpdate???
    {
      $push: { FavoriteMovies: req.params.movieID },
    },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
        console.error(err);
        res.status(500).send('Error ' + err);
      } else {
        res.json(updatedUser)
      }
    });
});

// REMOVE remove a movie from favourites (DELETE)
router.delete('/:Username/movies/:movieID', passport.authenticate('jwt', { session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, //avoid findOneAndUpdate???
    { 
      $pull: { FavoriteMovies: req.params.movieID}
  },
  {new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// REMOVE a user by username (DELETE)
router.delete('/:Username', passport.authenticate('jwt', { session: false}), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username }) //avoid findOneAndRemove???
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' has been deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

module.exports = router;