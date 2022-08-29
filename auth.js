const jwtSecret = 'your_jwt_secret'; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport'); //local passport file

// with this function I create a JWT based on the username and password, which will be send back as a response to the client
let generateJWTToken = (user) => { 
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, // This is the username you’re encoding in the JWT
        expiresIn: '1d', // This specifies that the token will expire in 1 day
        algorithm:'HS256'  // This is the algorithm used to “sign” or encode the values of the JWT
    });
}

/* POST login. */
module.exports = (router) => {
    router.post('/login', (req, res) => { //post method to endpoint "/login"
        passport.authenticate('local', {session: false }, (error, user, info) => {
            if (error || !user) { //if an error occures or this user is unknown -> show the error message
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error)  {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
}