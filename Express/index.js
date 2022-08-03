// To import express into the package
const express = require('express'); //imports the express module locally so it can be used within the file
const morgan = require('morgan');
const app = express(); // declares a variable that encapsulates Express’s functionality to configure my web server. This new variable is what I will use to route my HTTP requests and responses.

let topMovies = [
  {
    Title: "Into the wild",
    Director: "Sean Penn"
  },
  {
    Title: "Brokeback Mountain",
    Director: "Ang Lee"
  },
  {
    Title: "Joker",
    Director: "Todd Phillips"
  },
  {
    Title: "the Social Network",
    Director: "David Fincher"
  },
  {
    Title: "Call me by your name",
    Director: "Luca Guadagnino"
  },
  {
    Title: "Come on Come on",
    Director: "Mike Mills"
  },
  {
    Title: "Moonlight",
    "Director": "Barry Jenkins"
  },
  {
    Title: "Dumb & Dumber",
    "Director": "Peter Farrelly"
  },
  {
    Title: "Ace Ventura",
    Director: "Tom Shadyac"
  },
  {
    Title: "The Lord of the Rings: The Return of the King",
    Director: "Peter Jackson"
  }
]

// logs date and time to the terminal 
app.use(morgan('common'));

app.use('/documentation.html', express.static('public'));

// requests and sends the home URL to the browser
app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});
// requests and sends the secreturl URL to the browser
app.get('/secreturl', (req, res) => {
  res.send('This is a secret url with super top-secret content.');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/documentation.html', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
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