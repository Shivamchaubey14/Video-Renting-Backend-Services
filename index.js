const config = require('config');
console.log('App Name:', config.get('name'));
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(helmet());
app.use(morgan('tiny'));
const { connectDB, sequelize } = require('./db');
const userRoutes = require('./routes/userRoutes');
const genreRoutes = require('./routes/genereRoute');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// routes
app.use('/', userRoutes);
app.use('/api/', genreRoutes);
app.use('/api', userRoutes);

// start server
const PORT = process.env.PORT || 3000;

async function start() {
    await connectDB();

    // sync models (creates table if not exists)
    await sequelize.sync();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

start();