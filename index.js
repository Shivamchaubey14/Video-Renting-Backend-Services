const error = require('./middlewares/error');

const dbDebugger = require('debug')('app:db');
const startupDebugger = require('debug')('app:startup');

const config = require('config');

const winston = require('winston');

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

config.get('jwtPrivateKey');

require('dotenv').config();


// Winston transport
winston.add(
    new winston.transports.File({
        filename: 'logfile.log',
        level: 'info'
    })
);


// JWT key check
if (!config.get('jwtPrivateKey')) {

    winston.error('FATAL ERROR: jwtPrivateKey is not defined.');

    process.exit(1);
}


const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(helmet());
app.use(morgan('tiny'));

const { connectDB, sequelize } = require('./db');

const userRoutes = require('./routes/userRoutes');
const genreRoutes = require('./routes/genereRoutes');
const movieRoutes = require('./routes/movieRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// Routes
app.use('/api/genres', genreRoutes);
app.use('/api/customers', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/auth', authRoutes);


// Error middleware
app.use(error);

const PORT = process.env.PORT || 3000;


async function start() {

    try {

        await connectDB();

        startupDebugger('Application started in development mode');

        dbDebugger('Database connected');

        // Winston logs
        winston.info('Database connected successfully');

        app.listen(PORT, () => {

            winston.info(`Server running on port ${PORT}`);

            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {

        winston.error(err.message);
    }
}

start();