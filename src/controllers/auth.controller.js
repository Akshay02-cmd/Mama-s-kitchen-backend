/**
 * @fileoverview Authentication controller handling user registration and login
 * @module controllers/auth.controller
 * @requires http-status-codes
 * @requires ../model/user.model
 */

import { StatusCodes } from "http-status-codes";
import User from "../model/user.model.js";

/**
 * Register a new user account
 * 
 * @async
 * @function register
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.name - User's full name
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password (will be hashed)
 * @param {string} req.body.role - User role (CUSTOMER or OWNER)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with user data and JWT token
 * 
 * @example
 * POST /auth/register
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "password123",
 *   "role": "CUSTOMER"
 * }
 */
const register = async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res.cookie("token", token, {
      httpOnly: true,
    });
    res.status(StatusCodes.CREATED).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

/**
 * Authenticate user and generate JWT token
 * 
 * @async
 * @function login
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {string} req.body.role - User role for validation
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with user data and JWT token
 * 
 * @example
 * POST /auth/login
 * {
 *   "email": "john@example.com",
 *   "password": "password123",
 *   "role": "CUSTOMER"
 * }
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Please provide email and password" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials (email)" });
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials (password)" });
    }
    const token = user.createJWT();
    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
      user1: req.user,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/**
 * Logout user by clearing authentication cookie
 * 
 * @function logout
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void} JSON response confirming logout
 * 
 * @example
 * POST /auth/logout
 * Cookie: token=<jwt-token>
 * 
 * @description
 * Clears the httpOnly authentication cookie and ends the user session.
 * For Bearer token authentication, client should remove token from storage.
 */

const logout = (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), 
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Logout failed" });
  }
};

export { login, register, logout };