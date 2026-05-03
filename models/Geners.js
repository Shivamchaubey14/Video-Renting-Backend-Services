const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Genre = sequelize.define('Genre', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING
}, {
    tableName: 'genres',
    timestamps: false
});

module.exports = Genre;

// MongoDB version (if needed in future)
// const mongoose = require('mongoose');
// const genreSchema = new mongoose.Schema({
//     name: String
// });
// module.exports = mongoose.model('Genre', genreSchema);