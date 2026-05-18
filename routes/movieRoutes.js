/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie APIs
 */
const express = require('express');
const router = require('express').Router();

const asyncHandler = require('express-async-handler');

const Movie = require('../models/Movie');
const Genre = require('../models/Genre');

const validateMovie = require('../middlewares/validateMovie');

/**
 * @swagger
 * /movies/data:
 *   get:
 *     summary: Get all movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: List of movies
 */

// GET all movies
router.get(
    '/data',
    asyncHandler(async (req, res) => {

        const movies = await Movie.find()
            .populate('genres', 'name');

        res.json(movies);
    })
);
/**
 * @swagger
 * /movies/data:
 *   post:
 *     summary: Create movie
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - releaseYear
 *               - genres
 *             properties:
 *               title:
 *                 type: string
 *                 example: Avengers
 *               releaseYear:
 *                 type: number
 *                 example: 2020
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - 664f2ab12a4c9d1234567890
 *     responses:
 *       201:
 *         description: Movie created
 *       400:
 *         description: Invalid genre IDs
 */

// Create a new movie
router.post(
    '/data/',
    validateMovie,
    asyncHandler(async (req, res) => {

        const { title, releaseYear, genres } = req.body;

        // Check if all genre IDs are valid
        const validGenres = await Genre.find({
            _id: { $in: genres }
        });

        if (validGenres.length !== genres.length) {
            return res.status(400).json({
                error: 'Invalid genre IDs'
            });
        }

        // Create movie
        const movie = new Movie({
            title,
            releaseYear,
            genres: validGenres
        });

        // Save movie
        const savedMovie = await movie.save();

        res.status(201).json(savedMovie);
    })
);


module.exports = router;