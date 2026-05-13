const express = require('express');
const router = require('express').Router();
const Movie = require('../models/Movie');
const Genre = require('../models/Genre');
const validateMovie = require('../middlewares/validateMovie');

// GET all movies

router.get('/data', async(req, res, next) => {
    try{
        const movies = await Movie.find().populate('genres', 'name');
        res.json(movies);
    } catch(err) {
        next(err);
    }
});


// Create a new movie

router.post('/data/', validateMovie, async(req, res, next) => {
    try {
        const { title, releaseYear, genres } = req.body;

        // Check if all genre IDs are valid
        const validGenres = await Genre.find({
            _id: {$in: genres}
        });

        if (validGenres.length !== genres.length) {
            return next(new Error('Invalid genre IDs'));
        }

        const movie = new Movie({
            title,
            releaseYear,
            genres: validGenres
        });

        const savedMovie = await movie.save();
        res.status(201).json(savedMovie);
    } catch(err) {
        next(err);
    }
});


module.exports = router;