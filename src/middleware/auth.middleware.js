import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/index.js";

const auth = async (req, res, next) => {
  const cookieToken = req.cookies?.token;
  const authHeader = req.headers.authorization;

  let token;

  if (cookieToken) {
    token = cookieToken;
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Auth Middleware] Using cookie token');
    }
  } else if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Auth Middleware] Using Bearer token from header');
    }
  }

  if (!token) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Auth Middleware] No token found - cookieToken:', !!cookieToken, 'authHeader:', !!authHeader);
    }
    throw new UnauthorizedError("Authentication invalid");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: payload.userId,
      name: payload.name,
      role: payload.role,
    };
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Auth Middleware] Token verified for user:', req.user.name, 'Role:', req.user.role);
    }
    next();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Auth Middleware] Token verification failed:', error.message);
    }
    throw new UnauthorizedError("Authentication invalid");
  }
};

export default auth;
