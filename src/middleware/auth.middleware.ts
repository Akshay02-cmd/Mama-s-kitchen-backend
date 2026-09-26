import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/index.js";
import type { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        name: string;
        role: string;
      };
    }
  }
}

interface AuthPayload {
  userId: string;
  name: string;
  role: string;
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
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
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const payload = jwt.verify(token, jwtSecret);
    if (typeof payload === "string") {
      throw new Error("Invalid JWT payload");
    }

    const userPayload = payload as typeof payload & Partial<AuthPayload>;
    if (!userPayload.userId || !userPayload.name || !userPayload.role) {
      throw new Error("Invalid JWT payload");
    }

    req.user = {
      userId: userPayload.userId,
      name: userPayload.name,
      role: userPayload.role,
    };
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Auth Middleware] Token verified for user:', req.user.name, 'Role:', req.user.role);
    }
    next();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[Auth Middleware] Token verification failed:',
        error instanceof Error ? error.message : error,
      );
    }
    throw new UnauthorizedError("Authentication invalid");
  }
};

export default auth;
