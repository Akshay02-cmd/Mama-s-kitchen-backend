import Joi from "joi";

export const reviewSchema = Joi.object({
  user: Joi.string().hex().length(24).required(),
  mess: Joi.string().hex().length(24).required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow("").optional(),
});

export const reviewUpdateSchema = Joi.object({
  rating: Joi.number().min(1).max(5).optional(),
  comment: Joi.string().allow("").optional(),
});
