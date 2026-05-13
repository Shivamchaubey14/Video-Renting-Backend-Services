const express = require('express');
const router = require('express').Router();

const mongoose = require('mongoose');

const Movie = require('../models/Movie');
const Genre = require('../models/Genre');
const Rental = require('../models/Rental');

const validateMovie = require('../middlewares/validateMovie');
const validateRental = require('../middlewares/validateRental');


// GET all rentals
router.get('/data', async (req, res, next) => {
    try {
        const rentals = await Rental.find()
            .populate('movie', 'title')
            .populate('user', 'name');

        res.json(rentals);

    } catch (err) {
        next(err);
    }
});


// Create a new rental
router.post('/data', validateRental, async (req, res, next) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const { movieId, userId, rentalDate } = req.body;

        const rental = new Rental({
            movie: movieId,
            user: userId,
            rentalDate: rentalDate || Date.now()
        });

        await rental.save({ session });

        await session.commitTransaction();

        res.status(201).json(rental);

    } catch (err) {

        await session.abortTransaction();

        next(err);

    } finally {

        session.endSession();

    }
});

module.exports = router;