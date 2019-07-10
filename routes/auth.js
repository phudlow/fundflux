/**
    Router for handing auth endpoints
*/
const passport = require('../middleware/passport');
const router   = require('express').Router();

const { LOGIN_SUCCESSFUL } = require('../locale/en-us');

// Login credentials sent for authentication
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (info)  { return res.status(401).send({ error: info.message }); }
        if (err)   { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.login(user, (err) => {
            if (err) { return next(err); }
            res.send({ message: LOGIN_SUCCESSFUL });
        });
    })(req, res, next);
});

// Login page
router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.send('Accessed the login page.');
});

router.get('/logout', function(req, res, next) {
    if (req.isAuthenticated()) {
        req.logout();
        return res.redirect('/login?fromLogout=true');
    }
    res.redirect('/login');
});

// All routes declared after this require authentication
router.use((req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return;
    }
    next();
});

router.get('/', (req, res) => {
    res.send('Accessed a page which requires auth.');
});

module.exports = router;
