const express = require('express');
const router = require('express').Router();
const Genre = require('../models/Geners');
const validateGenre = require('../middlewares/validateGener');


// GET all genres
router.get('/genres', async(req, res) => {
    try {
        const genres = await Genre.findAll();
        res.json(genres);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

// Get genre by ID
router.get('/genres/:id', async(req, res) => {
    try {
        const genre = await Genre.findByPk(req.params.id);
        if(!genre) {
            return res.status(404).json({error: 'Genre not found'});
        }
        res.json(genre);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}); 

// Create a new genre
router.post('/genres', validateGenre, async(req, res) => {
    try {
        const genre = await Genre.create(req.body);
        res.status(201).json(genre);
    } catch(err) {
        res.status(400).json({error: err.message});
    }
});

// Update a genre
router.put('/genres/:id', validateGenre, async(req, res) => { 
    try {
        const genre = await Genre.findByPk(req.params.id);
        if(!genre) {
            return res.status(404).json({error: 'Genre not found'});
        }
        await genre.update(req.body);
        res.json(genre);
    } catch(err) {
        res.status(400).json({error: err.message});
    }
});

// DELETE A genre
router.delete('/genres/:id', async(req, res) => {
    try {
        const genre = await Genre.findByPk(req.params.id);
        if(!genre) {
            return res.status(404).json({error: 'Genre not found'});    
    }
        await genre.destroy();
        res.json({message: 'Genre deleted successfully'});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

module.exports = router;