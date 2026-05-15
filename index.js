require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const error = require('./middlewares/error');

const app = express();

require('./startup/logging')();

require('./startup/config')();

// CONNECT DATABASE HERE
require('./startup/db')();

app.set('view engine', 'pug');

app.set('views', './views');

app.use(express.json());

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'));
}

require('./startup/routes')(app);

app.use(error);

const PORT = process.env.PORT || 3000;

// START SERVER ONLY OUTSIDE TEST
if (process.env.NODE_ENV !== 'test') {
    require('./startup/server')(app, PORT);
}

module.exports = app;