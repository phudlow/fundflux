/**
    This file instantiates express session with our config.
    Uses connect-pg-simple to designate and configure PostgreSQL as the session store.
*/
const { pool }        = require('../db');
const uuid            = require('uuid');
const expressSession  = require('express-session');
const connectPgSimple = require('connect-pg-simple')(expressSession);

const session = expressSession({
    genid: req => uuid(),                 // generate universally unique ID to use as sessionID
    store: new connectPgSimple({ pool }), // see session table in init.sql created for this tool 
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    // cookie: {
    //     secure: true, // requires https
    //     maxAge: 1000 * 60 * 60 * 24 * 14 // 2 weeks
    // }
});

module.exports = session;
