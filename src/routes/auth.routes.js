/**
 * @fileoverview Authentication routes for user registration, login, and logout
 * @module routes/auth.routes
 * @requires express
 * @requires ../controllers/auth.controller
 * @requires ../middleware/validator.middelware
 * @requires ../validators/auth.validators
 */

import express from "express";
import { login, register, logout } from "../controllers/auth.controller.js";
import validate from "../middleware/validator.middelware.js";
import { RegisterSchema, LoginSchema } from "../validators/auth.validators.js";

const router = express.Router();

/**
 * @route POST /auth/register
 * @description Register a new user account
 * @access Public
 */
router.route("/register").post(validate(RegisterSchema), register);

/**
 * @route POST /auth/login
 * @description Login user and receive JWT token
 * @access Public
 */
router.route("/login").post(validate(LoginSchema), login);

/**
 * @route POST /auth/logout
 * @description Logout user and clear authentication cookie
 * @access Public
 */
router.route("/logout").post(logout);

export default router;
