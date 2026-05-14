const bcrypt = require('bcrypt');
const config = require('config');
const _ = require('lodash');

const asyncHandler = require('express-async-handler');

const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/User');
const Genre = require('../models/Genre');

const { validate } = require('../middlewares/validateAuth');


// POST login user
router.post(
    '/login',
    validate,
    asyncHandler(async (req, res) => {

        // Find user by email
        const user = await User.findOne({
            email: req.body.email
        });

        if (!user) {
            return res.status(400).json({
                error: 'Invalid email or password'
            });
        }

        // Compare password
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!validPassword) {
            return res.status(400).json({
                error: 'Invalid email or password'
            });
        }

        // Generate token
        const token = jwt.sign(
            {
                _id: user._id,
                name: user.name,
                email: user.email
            },
            config.get('jwtPrivateKey'),
            {
                expiresIn: '1h'
            }
        );  

        res.json({ token });
    })
);

module.exports = router;