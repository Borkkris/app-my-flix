const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); //hashing Passwords

let movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});

let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

//hashing the passwords of the users
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync (password, 10);
};

userSchema.methods.validatePassword = function(password) { //Don't use arrow functions when defining instance methods. "functions" will always refer to the object where the function has been called on
  return bcrypt.compareSync (password, this.Password);
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;