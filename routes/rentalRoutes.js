/**
 * @swagger
 * tags:
 *   name: Rentals
 *   description: Rental APIs
 */
const express = require('express');
const router = require('express').Router();

const mongoose = require('mongoose');

const asyncHandler = require('express-async-handler');

const Movie = require('../models/Movie');
const Genre = require('../models/Genre');
const Rental = require('../models/Rental');

const validateMovie = require('../middlewares/validateMovie');
const validateRental = require('../middlewares/validateRental');

/**
 * @swagger
 * /rentals/data:
 *   get:
 *     summary: Get all rentals
 *     tags: [Rentals]
 *     responses:
 *       200:
 *         description: List of rentals
 */

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

/**
 * @swagger
 * /rentals/data:
 *   post:
 *     summary: Create rental
 *     tags: [Rentals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
 *               - userId
 *             properties:
 *               movieId:
 *                 type: string
 *                 example: 664f2ab12a4c9d1234567890
 *               userId:
 *                 type: string
 *                 example: 664f2ab12a4c9d1234567891
 *               rentalDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Rental created
 */

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