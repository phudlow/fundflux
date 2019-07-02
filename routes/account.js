/**
    Router for handing account management endpoints
*/

const bcrypt    = require('bcrypt');
const { query } = require('../db');
const passport  = require('../middleware/passport');
const router    = require('express').Router();

// create user / account
router.post('/signup', async (req, res) => {
    const emailAvailable = !(await query('SELECT email FROM app_user WHERE email=$1', [req.body.email])).rowCount;
    if (!emailAvailable) {
        return res.status(409).send(`The email "${req.body.email}" is not available.`);
    }

    // create password hash then save new user
    const hash = await bcrypt.hash(req.body.password, 10);
    await query(
        'INSERT INTO app_user (email, password, signup_date, verified) VALUES ($1, $2, NOW(), false)',
        [req.body.email, hash]
    );
    res.status(201).send(`Account for "${req.body.email}" created successfully.`);
});

// remove user / account
router.post('/delete-account', async (req, res, next) => {

    // must also perform fresh authentication at delete time
    passport.authenticate('local', async (err, user, info) => {
        if (info)  { return res.status(422).send(info.message); }
        if (err)   { return next(err); }
        req.session.destroy(async err => {
            if (err) { return next(err); }

            // do delete, then redirect to /login
            const result = await query('DELETE FROM app_user WHERE id=$1 AND email=$2', [user.id, user.email]);
            if (result && result.rowCount) {
                console.log('Now redirecting to /login');
                res.redirect('/login');
            } else {
                next(new Error(`Could not delete account belonging to ${user.email}.`));
            }
        });
    })(req, res, next);
});

module.exports = router;
