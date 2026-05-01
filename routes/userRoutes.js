const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Genre = require('../models/Geners');
const validateUser = require('../middlewares/validateUser');


// Root
router.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

// GET all users
router.get('/data', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET user by ID
router.get('/data/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create new user
router.post('/data', validateUser, async(req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({error: err.message });
    }
});

// PUT update user by ID
router.put('/data/:id', validateUser, async(req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }
        await user.update(req.body);
        res.json(user);
    } catch (err) {
        res.status(400).json({error: err.message });
    }
});

// DELETE user by ID
router.delete('/data/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// ======================= Genres Routes =======================

module.exports = router;