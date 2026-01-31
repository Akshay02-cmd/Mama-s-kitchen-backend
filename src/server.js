import app from "./app.js";
import config from "./config/config.js";
import connectDB from "./services/connectDB.js";

const PORT = config.port || 5000;
const MONGO_URI = config.mongoose.url;

const start = async () => {
  if (!PORT) {
    console.error("PORT is not defined in environment variables");
    process.exit(1);
  }
  if (!MONGO_URI) {
    console.error("MONGODB_URL is not defined in environment variables");
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
