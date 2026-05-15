const mongoose = require('mongoose');
const dbDebugger = require('debug')('app:db');
require('dotenv').config();

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test_db?retryWrites=false');
        dbDebugger('MongoDB connected');
        console.log('✅ MongoDB connected to:', mongoose.connection.host);
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1); // crash instead of silently continuing
    }
}

module.exports = { connectDB };