const bcrypt = require('bcrypt');
const config = require('config');
const _ = require('lodash');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const Genre = require('../models/Genre');
const validateAuth = require('../middlewares/validateAuth');

// POST create new user
router.post('/login', validateAuth, async (req, res) => {
    try {

        let user = await User.findOne({ email: req.body.email});

        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        jwt.sign(
            { _id: user._id, name: user.name, email: user.email },
            config.get('jwtPrivateKey'),
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    return res.status(500).json({ error: 'Error generating token' });
                }
                res.json({ token });
            }
        );

    } catch (err) {

        res.status(400).json({
            error: err.message
        });

    }
});

module.exports = router;