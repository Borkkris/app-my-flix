// To import express into the package
const express = require('express'); //imports the express module locally so it can be used within the file
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const app = express(); // declares a variable that encapsulates Express’s functionality to configure my web server. This new variable is what I will use to route my HTTP requests and responses.
const mongoose = require('mongoose');
const Models = require('./models.js');

//express-validator for validation methods
const {check, validationResult } = require('express-validator');

//refer to the model names I defined in the “models.js” file
const Movies = Models.Movie;
const Users = Models.User;

//CORS is a mechanism which aims to allow requests made on behalf of you and at the same time block some requests made by rogue JS and is triggered whenever you are making an HTTP request to: a different domain
const cors = require('cors');

require('./auth')(app); // the app argument ensures that Express is available in my “auth.js” file as well.
const passport = require('passport');
require('./passport');

// Configure Allowed Domains for Cross-Origin Resource Sharing (CORS)
// let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234'];

app.use(cors()); // CORS Option 1: Allow all domains

// app.use(cors({ // CORS Option 2: Only allow specific domains (see the variable: allowedOrigins)
//   origin: (origin, callback) => {
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1) {// If a specific origin isn’t found on the list of allowed origins
//       let message = `The CORS policy for this application doesn't allow access from origin`+ origin;
//         return callback(new Error(message), false); 
//     }
//     return callback(null, true);
//   }
// }));

//This allows Mongoose to connect to that database (myFlixDB) so it can perform CRUD operations on the documents it contains from within my REST API
//local adress
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true }); 
//link (online)
// mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// logs date and time to the terminal 
app.use(morgan('common'));

// READ and sends the home URL to the browser with a message (GET)
app.get('/', (req, res) => {
  res.send('Welcome to myFlix app!');
});

// requests and sends the secreturl URL to the browser with a message (GET)
app.get('/secreturl', (req, res) => {
  res.send('This is a secret url with super top-secret content.');
});

// READ the API documentation Page (GET)
app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

// READ the list of all movies (GET)
app.get('/movies', /*passport.authenticate('jwt', { session: false}),*/ function (req, res) {
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
app.get('/movies/:Title', passport.authenticate('jwt', { session: false}), (req, res) => {
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
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false}), (req, res) => {
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
app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false}), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.directorName})
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

//Get all users (GET)
app.get('/users', passport.authenticate('jwt', { session: false}), (req, res) => {
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
app.get('/users/:Username', passport.authenticate('jwt', { session: false}), (req, res) => {
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
app.post('/users',
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
app.put('/users/:Username',

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
app.post('/users/:Username/movies/:movieID', passport.authenticate('jwt', { session: false}), (req,res) => {
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
app.delete('/users/:Username/movies/:movieID', passport.authenticate('jwt', { session: false}), (req, res) => {
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
app.delete('/users/:Username', passport.authenticate('jwt', { session: false}), (req, res) => {
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

const port = process.env.PORT || 8080;
app.listen(port,'0.0.0.0',() => {
  console.log('Your app is listening on Port ' + port);
});

// everytime an error in my code occurs it shows this console.log
// always defined last in the chain of middleware functions
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
  });