/**
 * @fileoverview Database configuration and connection setup
 * @module config/db.config
 * @requires mongoose
 */

import mongoose from "mongoose";

/**
 * Establishes connection to MongoDB database
 * 
 * @async
 * @function connectDB
 * @param {string} mongoURI - MongoDB connection string (local or Atlas)
 * @returns {Promise<void>} Resolves when connection is successful
 * @throws {Error} Exits process with code 1 if connection fails
 * 
 * @example
 * // Connect to local MongoDB
 * await connectDB('mongodb://localhost:27017/mamas-kitchen');
 * 
 * @example
 * // Connect to MongoDB Atlas
 * await connectDB('mongodb+srv://user:pass@cluster.mongodb.net/db');
 */
const connectDB = async (mongoURI) => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;