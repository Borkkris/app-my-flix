// To import express into the package
const express = require('express'); //imports the express module locally so it can be used within the file
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
/* const pathToSwaggerUi = require('swagger-ui-dist').absolutePath()*/

const app = express(); // declares a variable that encapsulates Express’s functionality to configure my web server. This new variable is what I will use to route my HTTP requests and responses.
const mongoose = require('mongoose');
// const Models = require('./models.js');

//express-validator for validation methods
// const {check, validationResult } = require('express-validator');

//CORS is a mechanism which aims to allow requests made on behalf of you and at the same time block some requests made by rogue JS and is triggered whenever you are making an HTTP request to: a different domain
const cors = require('cors');

app.use(cors()); // CORS Option 1: Allow all domains

require('./auth')(app); // the app argument ensures that Express is available in my “auth.js” file as well.
const passport = require('passport');
require('./passport');

// routes
const movieRoutes = require('./routes/movies');
const userRoutes = require('./routes/users');

// Configure Allowed Domains for Cross-Origin Resource Sharing (CORS)
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234'];

// for documentation
// app.use(express.static(pathToSwaggerUi))

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

app.all('/', function (req, res, next) { 
  res.header("Access-Control-Allow-Origin", "*"); 
  res.setHeader("Access-Control-Allow-Credentials", "true"); 
  next(); 
});

// This allows Mongoose to connect to that database (myFlixDB) so it can perform CRUD operations on the documents it contains from within my REST API
// local adress:
// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true }); 

//link (online) /URL with my password and DB:
mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

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

// all movie endpoints stored in movies.js
app.use('/movies', movieRoutes)

// all user endpoints stored in users.js
app.use('/users', userRoutes)

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