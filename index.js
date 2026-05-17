require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const error = require('./middlewares/error');

const app = express();

require('./startup/logging')();

require('./startup/config')();

require('./startup/db')();

app.set('view engine', 'pug');

app.set('views', './views');

app.use(express.json());

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'));
}

require('./startup/routes')(app);

app.use(error);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
    require('./startup/server')(app, PORT);
}

module.exports = app;