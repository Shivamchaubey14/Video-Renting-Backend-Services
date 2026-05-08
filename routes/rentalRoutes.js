const express = require('express');
const router = require('express').Router();
const Movie = require('../models/Movie');
const Genre = require('../models/Genre');
const validateMovie = require('../middlewares/validateMovie');
const validateRental = require('../middlewares/validateRental');
const Rental = require('../models/Rental');

// GET all rentals
router.get('/data', async(req, res) => {
    try{
        const rentals = await Rental.find().populate('movie', 'title').populate('user', 'name');
        res.json(rentals);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

// Create a new rental
router.post('/data', validateRental, async(req, res) => {
    try {
        const { movieId, userId, rentalDate } = req.body;
        const rental = new Rental({
            movie: movieId,
            user: userId,
            rentalDate: rentalDate || Date.now()
        });
        const savedRental = await rental.save();
        res.status(201).json(savedRental);
    }
    catch(err) {
        res.status(400).json({error: err.message});
    }
});

module.exports = router; 
