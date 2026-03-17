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
const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://192.168.0.131:5173",
  "https://mama-s-kitchen-rho.vercel.app",
];

const envAllowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envAllowedOrigins])];

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  // Allow Vercel preview deployments in addition to the production frontend URL.
  if (/^https:\/\/mama-s-kitchen-.*\.vercel\.app$/.test(origin)) {
    return true;
  }

  if (
    process.env.NODE_ENV !== "production" &&
    /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:\d+$/.test(origin)
  ) {
    return true;
  }

  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Mumma's Kitchen API Docs",
}));

// About route
app.get("/about", (req, res) => {
  res.json({
    name: "Mumma's Kitchen API",
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
