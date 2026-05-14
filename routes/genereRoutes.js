const express = require('express');
const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const Genre = require('../models/Genre');
const validateGenre = require('../middlewares/validateGenre');
const { auth } = require('../middlewares/validateAuth');
const validateIsAdmin = require('../middlewares/validateIsAdmin');


// GET all genres
router.get(
    '/data',
    asyncHandler(async (req, res) => {
        const genres = await Genre.find();
        res.json(genres);
    })
);


// Get genre by ID
router.get(
    '/data/:id',
    asyncHandler(async (req, res) => {
        const genre = await Genre.findById(req.params.id);

        if (!genre) {
            return res.status(404).json({ error: 'Genre not found' });
        }

        res.json(genre);
    })
);


// Create a new genre
router.post(
    '/data/',
    auth,
    validateGenre,
    asyncHandler(async (req, res) => {
        const genre = await Genre.create(req.body);
        res.status(201).json(genre);
    })
);


// Update a genre
router.put(
    '/data/:id',
    auth,
    validateGenre,
    asyncHandler(async (req, res) => {
        const genre = await Genre.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!genre) {
            return res.status(404).json({ error: 'Genre not found' });
        }

        res.json(genre);
    })
);


// DELETE a genre
router.delete(
    '/data/:id',
    auth,
    validateIsAdmin,
    asyncHandler(async (req, res) => {
        const genre = await Genre.findByIdAndDelete(req.params.id);

        if (!genre) {
            return res.status(404).json({ error: 'Genre not found' });
        }

        res.json({ message: 'Genre deleted successfully' });
    })
);

module.exports = router;  