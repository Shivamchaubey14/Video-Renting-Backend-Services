const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Genre = require('../models/Geners');
const validateUser = require('../middlewares/validateUser');


// Root
router.get('/', async (req, res) => {
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
router.get('/data', async (req, res) => {
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
        res.status(500).json({ error: err.message });
    }
});


// GET user by ID
router.get('/data/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
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

// PUT update user by ID (Query first Approach)
router.put('/data/:id', validateUser, async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }
        res.json(user);
    } catch (err) {
        res.status(400).json({error: err.message });
    }
});

// PUT update user by ID ( first Approach)

// router.put('/data/:id', validateUser, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Update fields manually
//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;

//     const updatedUser = await user.save();

//     res.json(updatedUser);

//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// DELETE user by ID
router.delete('/data/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// ======================= Genres Routes =======================

module.exports = router;