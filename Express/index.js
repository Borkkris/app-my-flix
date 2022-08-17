// To import express into the package
const express = require('express'); //imports the express module locally so it can be used within the file
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const app = express(); // declares a variable that encapsulates Express’s functionality to configure my web server. This new variable is what I will use to route my HTTP requests and responses.
const mongoose = require('mongoose');
const Models = require('./models.js');

//refer to the model names I defined in the “models.js” file
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;
//This allows Mongoose to connect to that database (myFlixDB) so it can perform CRUD operations on the documents it contains from within my REST API
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

//Users array
let users = [
  {
    id: 1,
    name: "Kim",
    favoriteMovies: [],
  },
  {
    id: 2,
    name: "Joe",
    favoriteMovies: ["Brokeback Mountain"],
  },
]

//Movies array
let movies = [
  {
    Title: "Into the wild",
    Director: "Sean Penn",
    Actors: [
    "Emile Hirsch",
    "Vince Vaughn",
    "Marcia Gay Harden",
    "William Hurt",
    "Jena Malone",
    "Catherine Keener",
    "Kristen Stewart",
    "Hal Holbrook"
  ],
    Genre: "Drama",
  },
  {
    Title: "Brokeback Mountain",
    Director: "Ang Lee",
    Actors: [
    "Jake Gyllenhaal",
    "Heath Ledger",
    "Anne Hathaway",
    "Randy Quaid",
    "Michelle Williams",
    "Kate Mara",
    "David Harbour",
    "Linda Cardellini"
  ],
    Genre: "Drama",
  },
  {
    Title: "Joker",
    Director: "Todd Phillips",
    Actors: [
    "Joaquin Phoenix",
    "Robert De Niro",
    "Zazie Beetz",
    "Brett Cullen",
    "Frances Conroy",
    "Josh Pais",
    "Brian Tyree Henry",
    "Sharon Washington"
  ],
    Genre: ["Drama", "Thriller"],
  },
  {
    Title: "the Social Network",
    Director: "David Fincher",
    Actors: [
    "Jesse Eisenberg",
    "Andrew Garfield",
    "Justin Timberlake",
    "Armie Hammer",
    "Rashida Jones",
    "Joseph Mazzello",
    "Max Minghella",
    "Rooney Mara"
  ],
    Genre: "Drama",
  },
  {
    Title: "Call me by your name",
    Director: "Luca Guadagnino",
    Actors: [
    "Timothée Chalamet",
    "Armie Hammer",
    "Michael Stuhlbarg",
    "Amira Casar",
    "Esther Garrel",
    "Victoire Du Bois"
  ],
    Genre: "Drama",
  },
  {
    Title: "Come on Come on",
    Director: "Mike Mills",
    Actors: [
    "Joaquin Phoenix",
    "Gaby Hoffmann",
    "Woody Norman",
    "Scoot McNairy"
  ],
    Genre: "Drama",
  },
  {
    Title: "Moonlight",
    Director: "Barry Jenkins",
    Actors: [
    "Ashton Sanders",
    "Alex R. Hibbert",
    "Trevante Rhodes",
    "Mahershala Ali",
    "Janelle Monáe",
    "Naomie Harris"
  ],
    Genre: "Drama",
  },
  {
    Title: "Dumb & Dumber",
    Director: "Peter Farrelly",
    Actors: [
    "Jim Carrey",
    "Jeff Daniels",
    "Lauren Holly",
    "Karen Duffy"
  ],
    Genre: "Comedy",
  },
  {
    Title: " 	Ace Ventura: Pet Detective",
    Director: "Tom Shadyac",
    Actors: [
    "Jim Carrey",
    "Courteney Cox",
    "Sean Young",
    "Udo Kier",
    "Dan Marino",
    "Troy Evans"
  ],
    Genre: "Comedy",
  },
  {
    Title: "The Lord of the Rings: The Return of the King",
    Director: "Peter Jackson",
    Actors: [
    "Elijah Wood",
    "Sean Astin",
    "Ian McKellen",
    "Andy Serkis",
    "Viggo Mortensen",
    "Orlando Bloom",
    "Miranda Otto",
    "Sean Bean",
    "Hugo Weaving",
    "Christopher Lee",
    "Billy Boyd",
    "Liv Tyler",
    "Dominic Monaghan",
    "John Rhys-Davies",
    "Karl Urban",
    "John Noble",
    "Cate Blanchett",
    "Ian Holm",
    "Bernard Hill",
    "David Wenham"
  ],
    Genre: ["Fantasy", "Fiction", "Fantasy Fiction"],
  }
]

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// logs date and time to the terminal 
app.use(morgan('common'));

app.use('/documentation.html', express.static('public'));

// READ and sends the home URL to the browser
app.get('/', (req, res) => {
  res.send('Welcome to myFlix app!');
});

// requests and sends the secreturl URL to the browser
app.get('/secreturl', (req, res) => {
  res.send('This is a secret url with super top-secret content.');
});

// READ the API documentation Page
app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

// READ the list of all movies
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

// READ the movie by title
app.get('/movies/:Title', (req, res) => {
  Movies.findOneAndRemove({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

// READ the Genre by Name
app.get('/movies/genre/:genreName', (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.genreName})
    .then((movie) => {
      res.json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

// READ the Director by name
app.get('/movies/directors/:directorName', (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.directorName})
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

//Get all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })//querying a specific user by their username, you need to pass, as a parameter, an object that contains the criteria 
    .then((user) => {//After the document is created, I then send a response back to the client with the user data (document) that was just read
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// CREATE a user
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
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

// Update a user's info, by username
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate ({ Username: req.params.Username
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
/*
// UPDATE a users name by id
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id) // used two == because these two id's will truthy be the same

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('user not found');
  }
});
*/

// Add a movie to a user's list of favorites
app.post('/user/:Username/movies/:movieID', (req,res) => {
  Users.findOneAndUpdate ({ Username: req.params.Username},
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
/*
// CREATE add a movie to the users array
app.post('/users/:id/:movieTitle', (req, res) => {
  const {id, movieTitle} = req.params;
  
  let user = users.find( user => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}`);
  } else {
    res.status(400).send(`${movieTitle} couldn\'t be added`);
  }
});
*/

// DELETE remove a movie from the Array
app.delete('/users/:Username/movies/:movieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
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

/*
// DELETE user 
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  
  let user = users.find( user => user.id == id);

  if (user) {
    users = users.filter( user => user.id != id) // use === when comparing strings
    res.status(200).send(`${id} has been deleted!`);
  } else {
    res.status(400).send(`${id} couldn't be deleted`);
  }
});
*/

// Delete a user by username
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
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

//listens to the localhost:8080
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

// everytime an error in my code occurs it shows this console.log
// always defined last in the chain of middleware functions
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
  });