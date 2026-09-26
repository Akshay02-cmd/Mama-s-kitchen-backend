import { ForbiddenError } from "../errors/index.js";
import type { Request, Response, NextFunction } from "express";
import type { Role } from "../config/roles.js";

const authorizeRoles = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role as Role)) {
      throw new ForbiddenError("Access denied");
    }
    next();
  };
};

export default authorizeRoles;
