const express = require('express');
const router = require('express').Router();

const asyncHandler = require('express-async-handler');

const Movie = require('../models/Movie');
const Genre = require('../models/Genre');

const validateMovie = require('../middlewares/validateMovie');


// GET all movies
router.get(
    '/data',
    asyncHandler(async (req, res) => {

        const movies = await Movie.find()
            .populate('genres', 'name');

        res.json(movies);
    })
);


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