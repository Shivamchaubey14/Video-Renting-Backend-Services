const Joi = require('joi');

const movieSchema = Joi.object({
    title: Joi.string().trim().required(),
    releaseYear: Joi.number().integer(),
    genres: Joi.array()
        .items(Joi.string().hex().length(24).required())
        .min(1)
        .required()
});

function validateMovie(req, res, next) {
    const {error} = movieSchema.validate(req.body);

    if(error) {
        return res.status(400).json({
            error: error.details[0].message
        });
    }
    next();
}

module.exports = validateMovie;