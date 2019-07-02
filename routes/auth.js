/**
    Router for handing auth endpoints
*/

const passport = require('../middleware/passport');
const router   = require('express').Router();

// login credentials sent for authentication
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (info)  { return res.status(422).send(info.message); }
        if (err)   { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.login(user, (err) => {
            if (err) { return next(err); }
            res.redirect('/');
        });
    })(req, res, next);
});

// login page
router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.send('Accessed the login page.');
});

// all routes declared after this require authentication
router.use((req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return;
    }
    next();
});

router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/login');
});

router.get('/', (req, res) => {
    res.send('Accessed a page which requires auth.');
});

module.exports = router;
