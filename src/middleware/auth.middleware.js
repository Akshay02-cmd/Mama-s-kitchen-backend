/**
 * @fileoverview JWT authentication middleware
 * @module middleware/auth.middleware
 * @requires jsonwebtoken
 * @requires ../errors/index
 */

import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/index.js";

/**
 * Authenticate user via JWT token from cookie or Authorization header
 * 
 * @async
 * @function auth
 * @param {Object} req - Express request object
 * @param {Object} req.cookies - Request cookies
 * @param {string} req.cookies.token - JWT token from cookie
 * @param {Object} req.headers - Request headers
 * @param {string} req.headers.authorization - Bearer token from header
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 * @throws {UnauthorizedError} If token is missing or invalid
 * 
 * @example
 * // Use as route middleware
 * router.get('/protected', auth, controller);
 * 
 * @description
 * Supports two authentication methods:
 * 1. Cookie-based: Token in httpOnly cookie
 * 2. Header-based: Bearer token in Authorization header
 * 
 * On success, attaches user data to req.user:
 * {
 *   userId: string,
 *   name: string,
 *   role: string
 * }
 */
const auth = async (req, res, next) => {
  const cookieToken = req.cookies?.token;
  const authHeader = req.headers.authorization;

  let token;

  if (cookieToken) {
    token = cookieToken;
  } else if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    throw new UnauthorizedError("Authentication invalid");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: payload.userId,
      name: payload.name,
      role: payload.role,
    };
    next();
  } catch (error) {
    throw new UnauthorizedError("Authentication invalid");
  }
};

export default auth;
