const express = require('express');
const router = require('express').Router();

const mongoose = require('mongoose');

const Movie = require('../models/Movie');
const Genre = require('../models/Genre');
const Rental = require('../models/Rental');

const validateMovie = require('../middlewares/validateMovie');
const validateRental = require('../middlewares/validateRental');


// GET all rentals
router.get('/data', async (req, res) => {
    try {
        const rentals = await Rental.find()
            .populate('movie', 'title')
            .populate('user', 'name');

        res.json(rentals);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Create a new rental
router.post('/data', validateRental, async (req, res) => {

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

        res.status(400).json({
            error: err.message
        });

    } finally {

        session.endSession();

    }
});

module.exports = router;