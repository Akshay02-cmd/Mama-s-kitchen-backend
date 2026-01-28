import Joi from "joi";

export const contactUsSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  message: Joi.string().min(10).max(1000).required(),
});
