import Joi from "joi";

const contactUsSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow("", null).max(30).optional(),
  subject: Joi.string().allow("", null).max(150).optional(),
  message: Joi.string().min(10).max(1000).required(),
});

export default contactUsSchema;