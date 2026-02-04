/**
 * @fileoverview Authentication controller handling user registration and login
 * @module controllers/auth.controller
 * @requires http-status-codes
 * @requires ../model/user.model
 */

import { StatusCodes } from "http-status-codes";
import { authService } from "../services/index.js";
import catchAsync from "../utils/catchAsync.js";

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
const register = catchAsync(async (req, res) => {
    const { user, token } = await authService.registerUser(req.body);
    
    res.cookie("token", token, {
      httpOnly: true,
    });
    
    res.status(StatusCodes.CREATED).json({
      success: true,
      user,
    });
});

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
const login = catchAsync(async (req, res) => {
    const { user, token } = await authService.loginUser(req.body);
    
    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      user,
    });
});


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

const logout = catchAsync(async (req, res) => {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), 
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Logged out successfully",
    });
});

export { login, register, logout };