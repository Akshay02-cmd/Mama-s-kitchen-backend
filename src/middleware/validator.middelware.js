/**
 * @fileoverview Joi schema validation middleware
 * @module middleware/validator.middleware
 */

/**
 * Validate request body against Joi schema
 * 
 * @function validate
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 * 
 * @example
 * import { RegisterSchema } from './validators/auth.validators.js';
 * router.post('/register', validate(RegisterSchema), register);
 * 
 * @description
 * Validates req.body against provided Joi schema
 * Returns 400 with detailed errors if validation fails
 * Calls next() if validation succeeds
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((d) => d.message),
      });
    }
    next(); 
  };
};

export default validate;