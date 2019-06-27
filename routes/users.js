const router   = require('express').Router();
const { query } = require('../db');

const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt        = require('bcrypt');

// Create new user
router.post('/users', async (req, res) => {

    // Check if the email is available
    const emailTaken = !!(await query('SELECT email FROM app_user WHERE email=$1', [req.body.email])).rowCount;
    if (emailTaken) {
        res.send(`${req.body.email} already exists!`);
    }

    // Create password hash then save new user
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
        const newUser = await query(
            'INSERT INTO app_user (email, password, signup_date, verified) VALUES ($1, $2, NOW(), false)',
            [req.body.email, hash]
        );

        res.send('Success');
    });
});

module.exports = router;
