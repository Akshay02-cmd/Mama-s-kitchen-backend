import Joi from "joi";

const objectIdSchema = Joi.string().length(24).hex().required();

export const CustomerSchema = Joi.object({
  userId: objectIdSchema,
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required(),
  address: Joi.string().min(10).max(300).required(),
});

export const OwnerSchema = Joi.object({
  usertId: objectIdSchema,
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required(),
  address: Joi.string().min(10).max(300).required(),
});

export const UpdateProfileSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/),
  address: Joi.string().min(10).max(300),
  is_Active: Joi.boolean(),
});

export const MessSchema = Joi.object({
  ownerId: objectIdSchema,
  name: Joi.string().min(3).max(100).required(),
  area: Joi.string().min(3).max(100).required(),
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required(),
  address: Joi.string().min(10).max(300).required(),
  description: Joi.string().min(10).max(500).required(),
  is_Active: Joi.boolean().required(),
});

export const UpdateMessSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/),
  address: Joi.string().min(10).max(300),
  area: Joi.string().min(3).max(100),
  description: Joi.string().min(10).max(500),
  is_Active: Joi.boolean(),
});
