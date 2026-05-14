const auth = require('../middlewares/validateAuth');
const validateUser = require('../middlewares/validateUser');
const asyncHandler = require('express-async-handler');
const Genre = require('../models/Genre');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const User = require('../models/User');


// Root
router.get(
    '/',
    asyncHandler(async (req, res) => {

        // Get users
        const userList = await User.find();
        console.log(userList);

        // Get latest 5 genres
        const genreList = await Genre.find()
            .limit(5)
            .sort({ name: 1 })
            .select('name');

        console.log(genreList);

        res.render('index', {
            title: 'Home',
            message: 'Welcome to My Express App',
            users: userList,
            genres: genreList
        });
    })
);


// Utility to escape regex
const escapeRegex = (text = '') =>
    text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');


// GET all users OR filter by query
router.get(
    '/data',
    asyncHandler(async (req, res) => {

        const { name } = req.query;

        let filter = {};

        // Apply filter if query exists
        if (name) {
            const safeName = escapeRegex(name);

            filter.name = {
                $regex: `^${safeName}$`,
                $options: 'i'
            };
        }

        const users = await User.find(filter);

        res.json(users);
    })
);


// GET user by ID
router.get(
    '/data/:id',
    asyncHandler(async (req, res) => {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        res.json(user);
    })
);


// POST create new user
router.post(
    '/data',
    validateUser,
    asyncHandler(async (req, res) => {

        // Generate salt
        const salt = await bcrypt.genSalt(10);

        // Hash password
        const hashedPassword = await bcrypt.hash(
            req.body.password,
            salt
        );

        // Create user
        const user = await User.create({
            ..._.pick(req.body, ['name', 'email', 'age']),
            password: hashedPassword,
            isAdmin: req.body.isAdmin || false
        });

        // Generate JWT token
        const token = jwt.sign(
            {
                _id: user._id,
                isAdmin: user.isAdmin
            },
            config.get('jwtPrivateKey')
        );

        console.log('The token is:', token);

        res
            .header('x-auth-token', token)
            .status(201)
            .json(user);
    })
);


// PUT update user by ID
router.put(
    '/data/:id',
    validateUser,
    asyncHandler(async (req, res) => {

        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        res.json(user);
    })
);


// DELETE user by ID
router.delete(
    '/data/:id',
    asyncHandler(async (req, res) => {

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        res.json({
            message: 'User deleted successfully'
        });
    })
);


// Get current user
router.get(
    '/me',
    asyncHandler(async (req, res) => {

        const token = req.header('x-auth-token');

        if (!token) {
            return res.status(401).json({
                error: 'Access denied. No token provided.'
            });
        }

        const decoded = jwt.verify(
            token,
            config.get('jwtPrivateKey')
        );

        const user = await User.findById(decoded._id)
            .select('-password');

        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        res.json(user);
    })
);


// ======================= Genres Routes =======================

module.exports = router;