import Joi from "joi";

const objectIdSchema = Joi.string().length(24).hex().required();

export const CustomerSchema = Joi.object({
  userId: objectIdSchema,
  phone: Joi.string()
    .pattern(/^[6-9]d{9}$/)
    .required(),
  address: Joi.string().min(10).max(300).required(),
});

export const OwnerSchema = Joi.object({
  usertId: objectIdSchema,
  phone: Joi.string()
    .pattern(/^[6-9]d{9}$/)
    .required(),
  address: Joi.string().min(10).max(300).required(),
  messName: Joi.string().min(3).max(100).required(),
  area: Joi.string().required(),
  description: Joi.string().min(10).max(400),
});

export const UpdateProfileSchema = Joi.object({
  phone: Joi.string().pattern(/^[6-9]d{9}$/),
  address: Joi.string().min(10).max(300),
  messName: Joi.string().min(3).max(100),
  area: Joi.string(),
  description: Joi.string().min(10).max(400),
});
