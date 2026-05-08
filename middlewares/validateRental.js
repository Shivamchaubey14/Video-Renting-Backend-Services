const Joi = require('joi');

const rentalSchema = Joi.object({
    userId: Joi.string().hex().length(24).required(),
    movieId: Joi.string().hex().length(24).required(),
    rentalDate: Joi.date().optional()
});

function validateRental(req, res, next) {

    const { error } = rentalSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        });
    }

    next();
}

module.exports = validateRental;