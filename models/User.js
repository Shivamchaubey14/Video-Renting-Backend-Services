// const { DataTypes } = require('sequelize');
// const { sequelize } = require('../db');

// const User = sequelize.define('User', {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     name: DataTypes.STRING,
//     age: DataTypes.INTEGER,
//     email: DataTypes.STRING
// }, {
//     tableName: 'users',
//     timestamps: false
// });

// module.exports = User;

// MongoDB version (if needed in future)
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String
});
module.exports = mongoose.model('User', userSchema);