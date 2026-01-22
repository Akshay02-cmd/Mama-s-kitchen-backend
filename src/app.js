/**
 * @fileoverview Express application configuration and middleware setup
 * @module app
 * @requires express
 * @requires dotenv
 * @requires cookie-parser
 * @requires ./routes/auth.routes
 * @requires ./routes/profile.routes
 * @requires ./routes/mess.routes
 */

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import profileRouter from "./routes/profile.routes.js";
import menuRouter from "./routes/menu.routes.js";
import contactRouter from "./routes/contact.routes.js";
import reviewRouter from "./routes/review.routes.js";
import orderRouter from "./routes/orders.routes.js";
import getUserRouter from "./routes/getUser.routes.js";

// Load environment variables from .env file

dotenv.config();

/**
 * Express application instance
 * @type {express.Application}
 */
const app = express();
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.redirect("/about");
});

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/menu", menuRouter);

//under construction routes
app.use("/users", getUserRouter);
app.use("/orders", orderRouter);
app.use("/reviews", reviewRouter);
app.use("/contacts", contactRouter);

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).send("Endpoint not found");
});

export default app;
