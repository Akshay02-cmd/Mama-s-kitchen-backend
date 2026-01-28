import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {
  authRouter,
  profileRouter,
  menuRouter,
  messRouter,
  orderRouter,
  getUserRouter,
} from "./routes/index.js";
import errorHandler from "./middleware/error.middelware.js";
import notfoundMiddleware from "./middleware/notfound.middelware.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.redirect("/about");
});

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/menu", menuRouter);
app.use("/mess", messRouter);
app.use("/users", getUserRouter);
app.use("/orders", orderRouter);
app.use("/reviews", reviewRouter);


// Handle 404 for undefined routes
app.use(notfoundMiddleware);

// Error handling middleware
app.use(errorHandler);

export default app;
