import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {
  authRouter,
  profileRouter,
  menuRouter,
  messRouter,
  contactRouter,
  reviewRouter,
  orderRouter,
  getUserRouter,
} from "./routes/index.js";

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
