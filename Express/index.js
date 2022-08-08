// To import express into the package
const express = require('express'); //imports the express module locally so it can be used within the file
const morgan = require('morgan');
const bodyParser = require('body-parser')
const uuid = require('uuid');

const app = express(); // declares a variable that encapsulates Express’s functionality to configure my web server. This new variable is what I will use to route my HTTP requests and responses.

app.use(bodyParser.json());

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
  res.status(200).json(movies);
});

// READ the movie by title
app.get('/movies/:title', (req, res) => {
  const { title } = req.params; //object destructure
  const movie = movies.find(movie => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('no such movie');
  }
});

// READ the Genre by genre
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find(movie => movie.Genre === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('no such Genre');
  }
});

// READ the Director by name
app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(movie => movie.Director === directorName).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('no such director');
  }
});

// CREATE a user
app.post('/users', (req, res) => {
  const newUser = req.body; // only readable from the body-parser beeing installed!

  if (newUser.name) {
    newUser.id = uuid.v4(); //crates an unique id for the user
    users.push(newUser);  
    res.status(201).json(newUser);
    
  } else {
    res.status(400).send('users need names');
  }
});

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
// DELETE remove a movie from the 
app.delete('/users/:id/:movieTitle', (req, res) => {
  const {id, movieTitle} = req.params;
  
  let user = users.find( user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle) // use === when comparing strings
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send(`${movieTitle} couldn't be removed`);
  }
});
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