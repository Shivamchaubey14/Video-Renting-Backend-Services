/**
 * @swagger
 * tags:
 *   name: Genres
 *   description: Genre management APIs
 */

const express = require('express');
const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const Genre = require('../models/Genre');
const validateGenre = require('../middlewares/validateGenre');
const { auth } = require('../middlewares/validateAuth');
const validateIsAdmin = require('../middlewares/validateIsAdmin');

/**
 * @swagger
 * /genres/data:
 *   get:
 *     summary: Get all genres
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: List of genres
 */

// GET all genres
router.get(
    '/data',
    asyncHandler(async (req, res) => {
        const genres = await Genre.find();
        res.json(genres);
    })
);

/**
 * @swagger
 * /genres/data/{id}:
 *   get:
 *     summary: Get genre by ID
 *     tags: [Genres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Genre found
 *       404:
 *         description: Genre not found
 */
// Get genre by ID
router.get(
    '/data/:id',
    asyncHandler(async (req, res) => {
        const genre = await Genre.findById(req.params.id);

        if (!genre) {
            return res.status(404).json({ error: 'Genre not found' });
        }

        res.json(genre);
    })
);

/**
 * @swagger
 * /genres/data:
 *   post:
 *     summary: Create a genre
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Action
 *     responses:
 *       201:
 *         description: Genre created
 *       401:
 *         description: Unauthorized
 */

// Create a new genre
router.post(
    '/data/',
    auth,
    validateGenre,
    asyncHandler(async (req, res) => {
        const genre = await Genre.create(req.body);
        res.status(201).json(genre);
    })
);

/**
 * @swagger
 * /genres/data/{id}:
 *   put:
 *     summary: Update genre
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Comedy
 *     responses:
 *       200:
 *         description: Genre updated
 *       404:
 *         description: Genre not found
 */

// Update a genre
router.put(
    '/data/:id',
    auth,
    validateGenre,
    asyncHandler(async (req, res) => {
        const genre = await Genre.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!genre) {
            return res.status(404).json({ error: 'Genre not found' });
        }

        res.json(genre);
    })
);
/**
 * @swagger
 * /genres/data/{id}:
 *   delete:
 *     summary: Delete genre
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Genre deleted
 *       404:
 *         description: Genre not found
 */

// DELETE a genre
router.delete(
    '/data/:id',
    auth,
    validateIsAdmin,
    asyncHandler(async (req, res) => {
        const genre = await Genre.findByIdAndDelete(req.params.id);

        if (!genre) {
            return res.status(404).json({ error: 'Genre not found' });
        }

        res.json({ message: 'Genre deleted successfully' });
    })
);

module.exports = router;  