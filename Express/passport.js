const  passport = require('passport'),

    //“LocalStrategy,” defines your basic HTTP authentication for login requests. LocalStrategy takes a username and password from the request body and uses Mongoose to check your database for a user with the same username
    LocalStrategy = require('passport-local').Strategy,
    Models = require ('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy, //JWT Strategy
    ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password'
}, (username, password, callback) => {
    console.log(username + ' ' + password); //shows username and password in the console
    Users.findOne({Username: username}, (error, user) => {
        if (error) {
            comnsole.log(error);
            return callback(error);
        }

        if(!user) {
            console.log('incorrect username');
            return callback(null, false, {message: 'Incorrect username or password.'}); //If an error occurs, or if the username can’t be found within the database, an error message is passed to the callback:
        }

        console.log('finished');
        return callback(null, user);
    });
}));

passport. use(new JWTStrategy ({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), //authenticate users based on the JWT submitted alongside their request. The JWT is extracted from the header of the HTTP request
    secretOrKey: 'your_jwt_secret' //“secret” key to verify the signature of the JWT. This signature verifies that the sender of the JWT (the client) is who it says it is—and also that the JWT hasn’t been altered.
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
    .then((user) => {
        return callback(null, user);
    })
    .catch((error) => {
        return callback(error)
    });
}));