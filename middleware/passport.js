/**
   This file instantiates and configures passport using the local strategy.
   User and session data is saved in PostgreSQL (see /routes/auth.js) 
*/
const passport       = require('passport');
const LocalStrategy  = require('passport-local').Strategy;
const bcrypt         = require('bcrypt');
const { query }      = require('../db');

const { INVALID_CREDENTIALS } = require('../locale/en-us');

// configure passport to use the local strategy for authentication
passport.use(new LocalStrategy(
    { usernameField: 'email' }, 
    async (email, password, done) => {

        // Fetch user from db
        const user = (await query('SELECT * FROM app_user WHERE email=$1', [email])).rows[0];
        if (!user) {
            return done(null, false, { message: INVALID_CREDENTIALS });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            done(null, user);
        } else {
            done(null, false, { message: INVALID_CREDENTIALS });
        }
    }
));

// save user to the session store
passport.serializeUser((user, done) => { done(null, user.id); });

// retrieve user from the session store
passport.deserializeUser(async (id, done) => {
    query('SELECT * FROM app_user WHERE id=$1', [id])
    .then(res => done(null, res.rows[0]))
    .catch(error => done(error, false));
});

module.exports = passport;
