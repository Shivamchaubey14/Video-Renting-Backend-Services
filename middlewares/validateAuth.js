const Joi = require('joi');

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

module.exports = validate;