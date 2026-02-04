import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import {
  authRouter,
  profileRouter,
  menuRouter,
  messRouter,
  orderRouter,
  getUserRouter,
  reviewRouter,
  contactusRouter,
} from "./routes/index.js";

import errorHandler from "./middleware/error.middelware.js";
import notfoundMiddleware from "./middleware/notfound.middelware.js";


const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.redirect("/about");
});

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/mess", messRouter);
app.use("/menu", menuRouter);
app.use("/users", getUserRouter);
app.use("/orders", orderRouter);
app.use("/reviews", reviewRouter);
app.use("/contacts", contactusRouter);


// Handle 404 for undefined routes
app.use(notfoundMiddleware);

// Error handling middleware
app.use(errorHandler);

export default app;
