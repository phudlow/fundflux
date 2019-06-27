require('dotenv').config();

const app = require('express')();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(require('./routes/users'));

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));