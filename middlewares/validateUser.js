const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().email().required(),
    age: Joi.number().integer().positive().required()
});

function validateUser(req, res, next) {
    const {error} = userSchema.validate(req.body);

    if(error) {
        return res.status(400).json({
            error: error.details[0].message
        });
    }

    next();
}

module.exports = validateUser;