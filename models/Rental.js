const mongoose = require('mongoose');
const rentalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    rentalDate: {
        type: Date,
        default: Date.now
    },
    returnDate: Date
});

module.exports = mongoose.model('Rental', rentalSchema);