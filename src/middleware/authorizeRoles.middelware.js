import { ForbiddenError } from "../errors/index.js";

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError("Access denied");
    }
    next();
  };
};

export default authorizeRoles;
