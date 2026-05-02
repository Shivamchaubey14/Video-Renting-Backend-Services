const dbDebuggger = require('debug')('app:db');
require('dotenv').config({quiet:true});
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
    }
);

// test connection
async function connectDB() {
    try {
        await sequelize.authenticate();
        dbDebuggger('Database connected');
    } catch (error) {
        dbDebuggger('DB connection failed:', error);
    }
}

module.exports = { sequelize, connectDB };