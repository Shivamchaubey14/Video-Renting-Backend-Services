const Joi = require('joi');

const genreSchema = Joi.object({
    name: Joi.string().trim().required()
});

function validateGenre(req, res, next) {
    const {error} = genreSchema.validate(req.body);

    if(error) {
        return res.status(400).json({
            error: error.details[0].message
        });
    }

    next();
}

module.exports = validateGenre;