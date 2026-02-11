import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

import {
  authRouter,
  profileRouter,
  menuRouter,
  messRouter,
  orderRouter,
  getUserRouter,
  reviewRouter,
  contactusRouter,
  ownerRouter,
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

// API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Mama's Kitchen API Docs",
}));

// About route
app.get("/about", (req, res) => {
  res.json({
    name: "Mama's Kitchen API",
    version: "1.0.0",
    description: "RESTful API for meal ordering platform",
    documentation: "/api-docs",
    endpoints: {
      auth: "/auth",
      profile: "/profile",
      mess: "/mess",
      menu: "/menu",
      orders: "/orders",
      reviews: "/reviews",
      users: "/users",
      contacts: "/contacts",
      owner: "/owner",
    }
  });
});

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
app.use("/owner", ownerRouter);


// Handle 404 for undefined routes
app.use(notfoundMiddleware);

// Error handling middleware
app.use(errorHandler);

export default app;
