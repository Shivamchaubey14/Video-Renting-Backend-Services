const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({ 
    title: {
        type: String, 
        required: true,
        trim: true
    },
    releaseYear: {
        type: Number
    },
    genres: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required: true
    }]
});

module.exports = mongoose.model('Movie', movieSchema);