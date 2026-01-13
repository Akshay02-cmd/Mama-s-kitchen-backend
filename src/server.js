/**
 * @fileoverview Server entry point - initializes and starts the application
 * @module server
 * @requires ./app
 * @requires dotenv
 * @requires ./config/db.config
 */

import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

/**
 * Start the Express server and connect to database
 * @async
 * @function start
 * @returns {Promise<void>}
 * @throws {Error} Exits process if PORT or MONGO_URI missing or connection fails
 */
const start = async () => {
  if (!PORT) {
    console.error("PORT is not defined in environment variables");
    process.exit(1);
  }
  if (!MONGO_URI) {
    console.error("MONGO_URI is not defined in environment variables");
    process.exit(1);
  }

  try {
    await connectDB(MONGO_URI);
    app.listen(PORT, () => {
      console.log(
        `server is running on port ${PORT}
        link: http://localhost:${PORT}
     ` + new Date()
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
