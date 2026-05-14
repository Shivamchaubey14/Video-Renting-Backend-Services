const express = require('express');
const error = require('../middlewares/error');
const userRoutes = require('../routes/userRoutes');
const genreRoutes = require('../routes/genereRoutes');
const movieRoutes = require('../routes/movieRoutes');
const rentalRoutes = require('../routes/rentalRoutes');
const authRoutes = require('../routes/authRoutes');


module.exports = function (app) {
    app.use('/api/genres', genreRoutes);
    app.use('/api/customers', userRoutes);
    app.use('/api/movies', movieRoutes);
    app.use('/api/rentals', rentalRoutes);
    app.use('/api/auth', authRoutes);
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));
    app.use(express.json());
    app.use(error);   

}