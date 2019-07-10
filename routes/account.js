/**
    Router for handing account management endpoints
*/
const bcrypt    = require('bcrypt');
const { query } = require('../db');
const passport  = require('../middleware/passport');
const router    = require('express').Router();

const {
    EMAIL_MISSING,
    EMAIL_INVALID,
    EMAIL_UNAVAILABLE,
    PASSWORD_MISSING,
    PASSWORD_TOO_SHORT,
    PASSWORD_CHAR_REQ_FAIL,
    ACCOUNT_CREATED,
    ACCOUNT_DELETED
} = require('../locale/en-us');

function emailIsValid (email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Create user / account
router.post('/signup', async (req, res) => {
    const email    = req.body.email;
    const password = req.body.password;

    // Must provide email
    if (!email) {
        return res.status(400).send({ error: EMAIL_MISSING });
    }

    // Email must be correct format
    if (!emailIsValid(email)) {
        return res.status(400).send({ error: EMAIL_INVALID });
    }

    // Email cannot be taken by another account
    const emailAvailable = !(await query('SELECT email FROM app_user WHERE email=$1', [email])).rowCount;
    if (!emailAvailable) {
        return res.status(409).send({ error: EMAIL_UNAVAILABLE });
    }

    // Must provide password
    if (!password) {
        return res.status(400).send({ error: PASSWORD_MISSING });
    }

    // Must password must be at least 8 characters
    if (password.length < 8) {
        return res.status(422).send({ error: PASSWORD_TOO_SHORT });
    }

    // Must password must contain 3 of either lowercase, uppercase, numbers, or special characters
    let types = 0;
    [ /[a-z]/, /[A-Z]/, /[0-9]/, /[ \!"#\$%&'\(\)\*\+,\-\.\/\:;\<\=\>\?@\[\\\]\^_`\{\|\}~]/ ].forEach(regex => password.match(regex) && types++);
    if (types < 3) {
        return res.status(422).send({ error: PASSWORD_CHAR_REQ_FAIL });
    }

    // Create password hash then save new user
    const hash = await bcrypt.hash(req.body.password, 10);
    await query(
        'INSERT INTO app_user (email, password, signup_date, verified) VALUES ($1, $2, NOW(), false)',
        [email, hash]
    );
    res.status(201).send({ message: ACCOUNT_CREATED });
});

// Remove user / account
router.post('/delete-account', async (req, res, next) => {

    // Must also perform fresh authentication at delete time
    passport.authenticate('local', async (err, user, info) => {
        if (info)  { return res.status(401).send({ error: info.message }); }
        if (err)   { return next(err); }
        req.session.destroy(async err => {
            if (err) { return next(err); }

            // do delete, then redirect to /login
            const result = await query('DELETE FROM app_user WHERE id=$1 AND email=$2', [user.id, user.email]);
            if (result && result.rowCount) {
                res.send({ message: ACCOUNT_DELETED });
            } else {
                next(new Error(`Could not delete account belonging to ${user.email}.`));
            }
        });
    })(req, res, next);
});

module.exports = router;
