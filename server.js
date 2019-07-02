
// load environment vars
require('dotenv').config();

// import modules
const express    = require('express');
const helmet     = require('helmet');
const bodyParser = require('body-parser');
const session    = require('./middleware/session');
const passport   = require('./middleware/passport');

// create express server
const app = express();

// configure middlewares
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

// configure routes
app.use(require('./routes/account'));
app.use(require('./routes/auth'));

// start server
app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
