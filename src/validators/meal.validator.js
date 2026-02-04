import Joi from "joi";
const objectIdSchema = Joi.string().length(24).hex().required();

export const MealSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  mealType: Joi.string()
    .valid("breakfast", "lunch", "dinner", "snack")
    .required(),
  is_Veg: Joi.boolean().required(),
  description: Joi.string().min(10).max(500).required(),
  price: Joi.number().min(1).required(),
  is_Available: Joi.boolean().default(true),
});

export const UpdateMealSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  description: Joi.string().min(10).max(500),
  price: Joi.number().min(1),
  is_Available: Joi.boolean(),
});
