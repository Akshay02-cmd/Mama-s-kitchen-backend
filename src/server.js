import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

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
  } catch (error) {}
};

start();
