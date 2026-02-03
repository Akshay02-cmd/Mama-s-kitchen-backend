import joi from "joi";

export const RegisterSchema = joi.object({
  role: joi.string().valid("CUSTOMER", "OWNER").required(),
  name: joi.string().min(3).max(50).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

export const LoginSchema = joi.object({
  role: joi.string().valid("CUSTOMER", "OWNER").required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});
