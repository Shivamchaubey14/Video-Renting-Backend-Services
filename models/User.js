const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    email: DataTypes.STRING
}, {
    tableName: 'users',
    timestamps: false
});

module.exports = User;