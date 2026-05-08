const express = require('express');
const router = require('express').Router();
const Genre = require('../models/Genre');
const validateGenre = require('../middlewares/validateGenre');


// GET all genres
router.get('/data', async(req, res) => {
    try {
        const genres = await Genre.find();
        res.json(genres);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

// Get genre by ID
router.get('/data/:id', async(req, res) => {
    try {
        const genre = await Genre.findById(req.params.id);
        if(!genre) {
            return res.status(404).json({error: 'Genre not found'});
        }
        res.json(genre);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}); 

// Create a new genre
router.post('/data/', validateGenre, async(req, res) => {
    try {
        const genre = await Genre.create(req.body);
        res.status(201).json(genre);
    } catch(err) {
        res.status(400).json({error: err.message});
    }
});

// Update a genre
router.put('/data/:id', validateGenre, async(req, res) => { 
    try {
        const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if(!genre) {
            return res.status(404).json({error: 'Genre not found'});
        }
        res.json(genre);
    } catch(err) {
        res.status(400).json({error: err.message});
    }
});

// DELETE A genre
router.delete('/data/:id', async(req, res) => {
    try {
        const genre = await Genre.findByIdAndDelete(req.params.id);
        if(!genre) {
            return res.status(404).json({error: 'Genre not found'});    
        }
        res.json({message: 'Genre deleted successfully'});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

module.exports = router;