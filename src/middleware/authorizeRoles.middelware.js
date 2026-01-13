/**
 * @fileoverview Role-based access control middleware
 * @module middleware/authorizeRoles.middleware
 * @requires ../errors/index
 */

import { ForbiddenError } from "../errors/index.js";

/**
 * Authorize user based on role(s)
 * 
 * @function authorizeRoles
 * @param {...string} roles - Allowed roles (CUSTOMER, OWNER, etc.)
 * @returns {Function} Express middleware function
 * @throws {ForbiddenError} If user role not in allowed roles
 * 
 * @example
 * // Single role
 * router.post('/mess', auth, authorizeRoles('OWNER'), createMess);
 * 
 * @example
 * // Multiple roles
 * router.get('/admin', auth, authorizeRoles('ADMIN', 'SUPER_ADMIN'), handler);
 * 
 * @description
 * Must be used after auth middleware as it requires req.user.role
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError("Access denied");
    }
    next();
  };
};

export default authorizeRoles;
