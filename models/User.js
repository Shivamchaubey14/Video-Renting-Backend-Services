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
            validator: function(v) {
                const user = await mongoose.models.User.findOne({email: value});
                if(this._id) {
                    if(user && user._id.toString() !== this._id.toString()) {
                        return false;
                    }
                }
                return !user;
            }, 
            message: 'Email already exists'
        }
    }
});

module.exports = mongoose.model('User', userSchema);