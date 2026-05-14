const winston = require('winston');
const dbDebugger = require('debug')('app:db');

const { connectDB } = require('../db');

module.exports = async function () {

    await connectDB();

    dbDebugger('Database connected');

    winston.info('Database connected successfully');
}; 