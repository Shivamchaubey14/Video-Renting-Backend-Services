const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name : {
        type: String, 
        required: true,
    }, 
    age: Number, 

    email: {
        type: String,
        required: true, 
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
        validate: {
            validator: async function(v) {
                const user = await mongoose.models.User.findOne({email: v});
                if (this._id) {
                    if (user && user._id.toString() !== this._id.toString()) {
                        return false;
                    }
                }
                return !user;
            },
            message: 'Email already exists'
        }
    }, 
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', userSchema);