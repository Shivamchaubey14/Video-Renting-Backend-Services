const express = require('express');
const router = require('express').Router();
const Genre = require('../models/Genre');
const validateGenre = require('../middlewares/validateGenre');
const { auth } = require('../middlewares/validateAuth');
const validateIsAdmin = require('../middlewares/validateIsAdmin');


// GET all genres
router.get('/data', async(req, res, next) => {
    try {
        const genres = await Genre.find();
        res.json(genres);
    } catch(err) {
        next(err);
    }
});

// Get genre by ID
router.get('/data/:id', async(req, res, next) => {
    try {
        const genre = await Genre.findById(req.params.id);
        if(!genre) {
            return res.status(404).json({error: 'Genre not found'});
        }
        res.json(genre);
    } catch(err) {
        next(err);
    }
}); 

// Create a new genre
router.post('/data/', auth,validateGenre, async(req, res, next) => {
    try {
        const genre = await Genre.create(req.body);
        res.status(201).json(genre);
    } catch(err) {
        next(err);
    }
});

// Update a genre
router.put('/data/:id', auth, validateGenre, async(req, res, next) => { 
    try {
        const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if(!genre) {
            return res.status(404).json({error: 'Genre not found'});
        }
        res.json(genre);
    } catch(err) {
        next(err);
    }
});

// DELETE A genre
router.delete('/data/:id', auth, validateIsAdmin, async(req, res, next) => {
    try {
        const genre = await Genre.findByIdAndDelete(req.params.id);
        if(!genre) {
            return res.status(404).json({error: 'Genre not found'});    
        }
        res.json({message: 'Genre deleted successfully'});
    } catch(err) {
        next(err);
    }
});

module.exports = router;