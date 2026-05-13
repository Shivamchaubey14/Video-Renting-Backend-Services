const auth = require('../middlewares/validateAuth');
const validateUser = require('../middlewares/validateUser');
const Genre = require('../models/Genre');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Root
router.get('/', async (req, res, next) => {
    // Get the list of users and genres to display on the homepage
    const userList = await User.find();
    console.log(userList);

    const genreList = await Genre.find().limit(5).sort({ name: 1 }).select('name'); // Get the latest 5 genres
    console.log(genreList);
    res.render('index', { title: 'Home', message: 'Welcome to My Express App', users: userList, genres: genreList });
});

// Utility to escape regex
const escapeRegex = (text = '') =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET all users OR filter by query
router.get('/data', async (req, res, next) => {
    try {
        const { name } = req.query;

        let filter = {};

        // If query param exists → apply filter
        if (name) {
            const safeName = escapeRegex(name);
            filter.name = { $regex: `^${safeName}$`, $options: 'i' };
        }

        const users = await User.find(filter);

        res.json(users);

    } catch (err) {
        next(err);
    }
});


// GET user by ID            
router.get('/data/:id', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) {
        next(err);
    }
});

// POST create new user
router.post('/data', validateUser, async (req, res, next) => {
    try {  
        // Hash the password
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            req.body.password,
            salt
        );

        // Create user with hashed password
        const user = await User.create({
            ..._.pick(req.body, ['name', 'email', 'age']),
            password: hashedPassword,
            isAdmin: req.body.isAdmin || false
        });
        const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, config.get('jwtPrivateKey'));
        console.log("The token is: ", token);
        res.header('x-auth-token', token).status(201).json(user);

    } catch (err) {

        next(err);

    }
});

// PUT update user by ID (Query first Approach)
router.put('/data/:id', validateUser, async(req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
});


// DELETE user by ID
router.delete('/data/:id', async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        next(err);
    }
});

// Getting the current user

router.get('/me', async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) {
            return next(new Error('Access denied. No token provided.') );
        }
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        const user = await User.findById(decoded._id).select('-password');
        res.json(user);
    } catch (err) {
        next(err);
    }
});


// ======================= Genres Routes =======================

module.exports = router;