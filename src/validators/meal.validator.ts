import Joi from "joi";
const objectIdSchema = Joi.string().length(24).hex().required();

const ExtraItemSchema = Joi.object({
  name: Joi.string().min(2).max(60).required(),
  price: Joi.number().min(0).required(),
  is_Available: Joi.boolean().default(true),
});

export const MealSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  mealType: Joi.string()
    .valid("breakfast", "lunch", "dinner", "snack")
    .required(),
  is_Veg: Joi.boolean().required(),
  description: Joi.string().min(10).max(500).required(),
  image: Joi.string().uri(),
  price: Joi.number().min(1).required(),
  is_Available: Joi.boolean().default(true),
  extras: Joi.array().items(ExtraItemSchema).default([]),
  messId: Joi.string().length(24).hex(),
});

export const UpdateMealSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  description: Joi.string().min(10).max(500),
  image: Joi.string().uri(),
  price: Joi.number().min(1),
  is_Available: Joi.boolean(),
  extras: Joi.array().items(ExtraItemSchema),
});
