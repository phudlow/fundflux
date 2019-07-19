// Load environment vars
require('dotenv').config();

// Import modules
const express    = require('express');
const helmet     = require('helmet');
const bodyParser = require('body-parser');
const cors       = require('./middleware/cors');
const session    = require('./middleware/session');
const passport   = require('./middleware/passport');

// Create express server
const app = express();

// Configure middlewares
app.use(cors);
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

// Configure routes
app.use(require('./routes/user'));
app.use(require('./routes/auth'));
app.use(require('./routes/app'));
app.use(require('./routes/project'));
app.use(require('./routes/plan'));
app.use(require('./routes/account'));
app.use(require('./routes/transaction'));
app.use(require('./routes/delta'));

// Start server
app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
