require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const winston = require('winston');

const error = require('./middlewares/error');

const startupDebugger = require('debug')('app:startup');

const app = express();

winston.add(
    new winston.transports.File({
        filename: 'logfile.log',
        level: 'info'
    })
);

if (!config.get('jwtPrivateKey')) {
    winston.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

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

async function start() {
    try {

        await require('./startup/db')();

        startupDebugger('Application started in development mode');

        app.listen(PORT, () => {

            winston.info(`Server running on port ${PORT}`);

            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {

        winston.error(err.message);

        process.exit(1);
    }
}

start();