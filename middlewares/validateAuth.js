const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(1024).required()
})

function validate(req, res, next) {
    const {error} = schema.validate(req.body);

    if(error) {
        return res.status(400).json({
            error: error.details[0].message
        });
    }

    next();
}

function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token.' });
    }
}

module.exports = { validate, auth };