import express from "express";
import { login, register, logout } from "../controllers/auth.controller.js";
import validate from "../middleware/validator.middelware.js";
import { RegisterSchema, LoginSchema } from "../validators/auth.validators.js";

const router = express.Router();

router.route("/register").post(validate(RegisterSchema), register);
router.route("/login").post(validate(LoginSchema), login);
router.route("/logout").post(logout);

export default router;
