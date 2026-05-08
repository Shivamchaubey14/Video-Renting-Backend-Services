const dbDebugger = require('debug')('app:db');
const startupDebugger = require('debug')('app:startup');
const config = require('config');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// routes
app.use('/api/genres', genreRoutes);
app.use('/api/customers', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/rentals', rentalRoutes);
// start server
const PORT = process.env.PORT || 3000;

async function start() {
    await connectDB(); // this now calls connectMongoDB
    startupDebugger('Application started in development mode');
    dbDebugger('Database connected'); // ✅ fixed
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

start();