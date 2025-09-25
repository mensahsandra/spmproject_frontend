// config/db.js
require('dotenv').config({ path: './config/.env' });
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Direct connection string for MongoDB Atlas with appName for better monitoring
        const dbUrl = process.env.MONGO_URI || "mongodb+srv://sandramensah243_db_user:BLfftPv57vGS28sr@studentmatrix0.39egn6a.mongodb.net/students-performance-db?retryWrites=true&w=majority&appName=StudentMatrixApp";
        
        console.log("Attempting to connect to MongoDB", dbUrl.includes('mongodb+srv://') ? 'Atlas SRV' : 'instance');
        
        // Set timeouts to avoid hanging if MongoDB is unreachable
        const options = { 
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000
        };
        
        const conn = await mongoose.connect(dbUrl, options);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Add more diagnostic info
        console.log(`DB Connection State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
        console.log(`DB Name: ${mongoose.connection.name || 'Not available'}`);
        
        return conn;
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        console.warn("Continuing without database connection - using in-memory data only");
        // Don't exit process - let the server run with mock data
        throw error; // Re-throw for proper handling in index.js
    }
};

module.exports = connectDB;