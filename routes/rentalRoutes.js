const express = require('express');
const router = require('express').Router();

const mongoose = require('mongoose');

const asyncHandler = require('express-async-handler');

const Movie = require('../models/Movie');
const Genre = require('../models/Genre');
const Rental = require('../models/Rental');

const validateMovie = require('../middlewares/validateMovie');
const validateRental = require('../middlewares/validateRental');


// GET all rentals
router.get(
    '/data',
    asyncHandler(async (req, res) => {

        const rentals = await Rental.find()
            .populate('movie', 'title')
            .populate('user', 'name');

        res.json(rentals);
    })
);


// Create a new rental
router.post(
    '/data',
    validateRental,
    asyncHandler(async (req, res) => {

        const session = await mongoose.startSession();

        try {

            session.startTransaction();

            const {
                movieId,
                userId,
                rentalDate
            } = req.body;

            // Create rental
            const rental = new Rental({
                movie: movieId,
                user: userId,
                rentalDate: rentalDate || Date.now()
            });

            // Save rental inside transaction
            await rental.save({ session });

            // Commit transaction
            await session.commitTransaction();

            res.status(201).json(rental);

        } catch (err) {

            // Rollback transaction
            await session.abortTransaction();

            throw err;

        } finally {

            session.endSession();
        }
    })
);

module.exports = router;