const Joi = require('joi');
const JoiObjectId = require('joi-objectid')(Joi);

const rentalSchema = Joi.object({
    userId: JoiObjectId().required(),
    movieId: JoiObjectId().required(),
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