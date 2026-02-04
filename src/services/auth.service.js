/**
 * @fileoverview Authentication Service
 * @module services/auth.service
 * @description Business logic for user authentication operations
 */

import User from "../model/user.model.js";
import { BadRequestError, UnauthorizedError, NotFoundError } from "../errors/index.js";

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @param {string} userData.role - User role (CUSTOMER or OWNER)
 * @returns {Promise<Object>} Created user object with JWT token
 * @throws {BadRequestError} If user creation fails
 */
export const registerUser = async (userData) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new BadRequestError("User with this email already exists");
  }

  // Create user (password will be hashed by pre-save hook)
  const user = await User.create(userData);
  
  if (!user) {
    throw new BadRequestError("Unable to create user");
  }

  // Generate JWT token
  const token = user.createJWT();

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

/**
 * Authenticate user and generate JWT token
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User's email address
 * @param {string} credentials.password - User's password
 * @param {string} [credentials.role] - User role for validation (optional)
 * @returns {Promise<Object>} User object with JWT token
 * @throws {UnauthorizedError} If credentials are invalid
 * @throws {BadRequestError} If email or password is missing
 */
export const loginUser = async (credentials) => {
  const { email, password, role } = credentials;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  // Verify password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid credentials");
  }

  // Optional: Verify role if provided
  if (role && user.role !== role) {
    throw new UnauthorizedError("Invalid role for this account");
  }

  // Generate JWT token
  const token = user.createJWT();

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User object
 * @throws {NotFoundError} If user not found
 */
export const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User object or null
 */
export const getUserByEmail = async (email) => {
  const user = await User.findOne({ email }).select("-password");
  return user;
};

const authService = {
  registerUser,
  loginUser,
  getUserById,
  getUserByEmail,
};

export default authService;
