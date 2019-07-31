/**
 * Router for handing auth endpoints
 */
const passport = require('../middleware/passport');
const router   = require('express').Router();

// Login credentials sent for authentication
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (info)  { return res.status(401).send({ error: info.message }); }
        if (err)   { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.login(user, (err) => {
            if (err) { return next(err); }
            res.send({ message: 'LOGIN_SUCCESSFUL' });
        });
    })(req, res, next);
});

// Login page
router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.sendFile('login.html', { root: './dist/' });
});

// Terminate session
router.get('/logout', function(req, res) {
    if (req.isAuthenticated()) {
        req.logout();
        return res.redirect('/login?fromLogout=true');
    }
    res.redirect('/login');
});
router.post('/logout', function(req, res) {
    if (req.isAuthenticated()) {
        req.logout();
    }
    res.sendStatus(200);
});

// All routes declared after this require authentication
router.use((req, res, next) => {
    if (!req.isAuthenticated()) {
        if (req.method === 'GET') {
            return res.redirect('/login');
        }
        return res.sendStatus(401);
    }
    next();
});

module.exports = router;
